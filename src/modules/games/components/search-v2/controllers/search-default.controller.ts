import {
    Injectable,
    inject,
    ElementRef,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {UIRouter} from '@uirouter/core';
import {TranslateService} from '@ngx-translate/core';

import {
    BehaviorSubject,
    Subject,
    filter,
    tap,
    Observable,
} from 'rxjs';
import _uniqBy from 'lodash-es/uniqBy';
import _sortBy from 'lodash-es/sortBy';
import _includes from 'lodash-es/includes';
import _filter from 'lodash-es/filter';
import _isEmpty from 'lodash-es/isEmpty';
import _concat from 'lodash-es/concat';
import _map from 'lodash-es/map';

import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {IGamesFilterData} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';
import {GamesFilterServiceEvents} from 'wlc-engine/modules/games/system/services/games-filter.service';
import {ISearchFieldCParams} from 'wlc-engine/modules/games/components/search-field/search-field.params';
import {
    EventService,
} from 'wlc-engine/modules/core';
import {
    AbstractSearchController,
    SearchMerchantListComponent,
    SearchCategoriesListComponent,
    SearchControlComponent,
    SearchResultComponent,
    SearchDefaultComponent,
} from 'wlc-engine/modules/games/components/search-v2';
import {IGamesGridCParams} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';
import {AbstractModalComponent} from 'wlc-engine/modules/core/system/classes';

export interface IControllerDefaultParams {
    titleText: string,
    gamesGridParams: IGamesGridCParams,
    searchFilterName: string,
    openProviders: boolean,
    theme: string,
    searchFieldParams: ISearchFieldCParams,
}

@Injectable()
export class SearchControllerDefault extends AbstractSearchController<IControllerDefaultParams> {
    public currentLanguage: string;
    public merchants$: Observable<MerchantModel[]>;
    public categories$: Observable<CategoryModel[]>;
    public filters$: Observable<IGamesFilterData>;
    public chooseMerchant$: Observable<MerchantModel>;
    public chooseCategory$: Observable<CategoryModel>;
    public readonly rootThemeComponent = SearchDefaultComponent;
    public readonly merchantsList = SearchMerchantListComponent;
    public readonly categoriesList = SearchCategoriesListComponent;
    public readonly controlPanel = SearchControlComponent;
    public readonly searchResult = SearchResultComponent;

    protected readonly eventService: EventService = inject(EventService);
    protected readonly translateService = inject(TranslateService);
    protected readonly router = inject(UIRouter);
    protected selectedCategories: CategoryModel[] = [];
    protected selectedMerchants: MerchantModel[] = [];

    private _merchants$: BehaviorSubject<MerchantModel[]> = new BehaviorSubject([]);
    private _categories$: BehaviorSubject<CategoryModel[]> = new BehaviorSubject([]);
    private _filters$: BehaviorSubject<IGamesFilterData> = new BehaviorSubject({});
    private _chooseMerchant$: Subject<MerchantModel> = new Subject();
    private _chooseCategory$: Subject<CategoryModel> = new Subject();
    private _filters: IGamesFilterData = {
        searchQuery: '',
        categories: [],
        merchants: [],
        excludeCategories: [],
        excludeMerchants: [],
    };

    constructor(
        protected readonly modal: AbstractModalComponent,
    ) {
        super();
        this.setValueObservers();
    }

    public override init(paramsController: IControllerDefaultParams): void {
        super.init(paramsController);
        this.searchFieldCParams = paramsController.searchFieldParams;
        this.gamesCatalogService.ready.then(()=> {
            this.checkCache();
            this.setCategories();
            this.setMerchants();
            this.initSubscribers();
            this.$resolveReady();
        });
    }

    public get currentLang(): string {
        return this.translateService.currentLang;
    }

    public get searchParams(): ISearchFieldCParams {
        return this.searchFieldCParams;
    }

    public get filterCategoriesLength(): number {
        return this._filters$.getValue().categories.length;
    }

    public get filterMerchantsLength(): number {
        return this._filters$.getValue().merchants.length;
    }

    public get filters(): IGamesFilterData {
        return this._filters$.value;
    }

    public setFilter(): void {
        this.gamesFilterService.set(this.props.searchFilterName, this._filters, true);
        this._filters$.next(this._filters);
    }

    public get modalHost(): ElementRef {
        return this.modal.element;
    }

    public setValueSearchQuery(query: string): void {
        this.searchQuery = query;
    }

    public setValueChooseMerchant(merchant: MerchantModel): void {
        this._chooseMerchant$.next(merchant);
    }

    public setValueChooseCategory(category: CategoryModel): void {
        this._chooseCategory$.next(category);
    }

    protected initSubscribers(): void {
        this.chooseMerchantSubscribe();
        this.chooseCategorySubscribe();
        this.searchQuerySubscribe();
        this.initSearchListeners();
    }

    protected searchQuerySubscribe(): void {
        this.searchQuery$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.setFilter();
            });
    }

    protected chooseMerchantSubscribe(): void {
        this._chooseMerchant$
            .pipe(
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((merchant: MerchantModel | null) => {
                if (!merchant) {
                    this.emptyHandler('merchants');
                    return;
                }
                this.makeFiltersMerchants(merchant);
            });
    }

    protected chooseCategorySubscribe(): void {
        this._chooseCategory$
            .pipe(
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((category: CategoryModel | null) => {
                if (!category) {
                    this.emptyHandler('categories');
                    return;
                }
                this.makeFiltersCategories(category);
            });
    }

    protected makeFiltersMerchants(merchant: MerchantModel): void {
        const merchId = merchant.id;
        if (_includes(this._filters.merchants, merchId)) {
            this._filters.merchants = _filter(
                this._filters.merchants,
                (merch: number) => merch !== merchId,
            );
        } else {
            this._filters.merchants.push(merchId);
        }

        if (this._filters.merchants.length) {
            this.selectedMerchants = _filter(this._merchants$.getValue(), merchant => {
                return _includes(this._filters.merchants, merchant.id);
            });
            this._categories$.next(_filter(this.getCategories(), category => {
                return category.hasSomeMerchant(this.selectedMerchants);
            }));
        } else {
            this.setCategories();
        }
        this.setFilter();
    }

    protected makeFiltersCategories(category: CategoryModel): void {
        const catId = category.slug;
        if (_includes(this._filters.categories, catId)) {
            this._filters.categories = _filter(
                this._filters.categories,
                (cat: string) => cat !== catId,
            );
        } else {
            this._filters.categories.push(catId);
        }

        if (this._filters.categories.length) {
            this.setSelectedCategories();
            const merchantsList = _concat(..._map(this.selectedCategories, category => category.merchants));
            this._merchants$.next(_sortBy(_uniqBy(merchantsList, 'id'), (merchant) => {
                return merchant.alias;
            }));
        } else {
            this.setMerchants();
        }
        this.setFilter();
    }

    protected emptyHandler(filterType: 'categories' | 'merchants'): void {
        const hasCurrentFilter = this._filters[filterType].length;

        this._filters[filterType] = [];

        if (filterType === 'categories') {
            this.selectedCategories = [];
            this.setMerchants();
        } else {
            this.selectedMerchants = [];
            this.setCategories();
        }

        if (hasCurrentFilter) {
            this.setFilter();
        }
    }

    protected getCategories(allCategories?: boolean): CategoryModel[] {
        if (allCategories) {
            return this.gamesCatalogService.getCategoriesForFilter();
        } else {
            return _uniqBy(this.gamesCatalogService.getCategoriesForFilter(), (item) => item.slug);
        }
    }

    protected setSelectedCategories(): void {
        this.selectedCategories = _filter(
            this.getCategories(this.gamesCatalogService.architectureVersion === 3),
            (category: CategoryModel) =>
            {
                return _includes(this._filters.categories, category.slug);
            },
        );
    }

    protected setCategories(): void {
        this._categories$.next(this.getCategories());
    }

    protected setMerchants(): void {
        const category = this.gamesCatalogService.getChildCategoryByState()
            || this.gamesCatalogService.getParentCategoryByState();

        const merchants = (category && this.selectedCategories.length)
            ? category.merchants
            : this.gamesCatalogService.getFilteredMerchants();

        this._merchants$.next(_sortBy(merchants, (merchant) => {return merchant.alias;}));
    }

    protected initSearchListeners(): void {
        this.eventService.subscribe({
            name: GamesFilterServiceEvents.FILTER_SEARCH,
            from: 'modal',
        }, (data: IGamesFilterData) => {
            this._filters.searchQuery = data.searchQuery;
        }, this.$destroy);

        this.modal.closed.then(() => {
            const notFeatReason = this.modal.modalDirect.dismissReason
                && this.modal.modalDirect.dismissReason !== 'backdrop-click'
                && this.modal.modalDirect.dismissReason !== 'esc';

            if (this.router.globals.current.name === 'app.gameplay' || notFeatReason) {
                return;
            }
            this.deleteFilter();
        });
    }

    /**
    * If there is a cached filter, the method initializes the component with this filter
    */
    protected initFromCache(): void {
        const filterCache: IGamesFilterData = _isEmpty(this.gamesFilterService.filterCache)
            ? null : this.gamesFilterService.filterCache[this.props.searchFilterName];

        if (this.gamesFilterService.$gamesFilterSubsIsReady.getValue()) {
            setTimeout(() => {
                this.filterCache(filterCache);
            }, 0);
        } else {
            this.gamesFilterService.$gamesFilterSubsIsReady
                .pipe(
                    filter(v => !!v),
                    tap(() => {
                        setTimeout(() => {
                            this.setFilter();
                        }, 0);
                    }),
                    takeUntilDestroyed(this.destroyRef),
                )
                .subscribe();
        }
    }

    protected filterCache(filterCache: IGamesFilterData): void {
        if (filterCache) {
            this._filters = {...filterCache};
            this.searchQuery = this._filters.searchQuery;
            this.gamesFilterService.set(this.props.searchFilterName, filterCache, true);
        } else {
            this.setFilter();
        }
    }

    protected checkCache(): void {
        this.searchFieldCParams = {
            searchQueryFromCache: this.searchQuery,
            searchFrom: this.props.searchFilterName,
            focus: true,
        };

        if (this.router.globals.current.name === 'app.gameplay'
            || this.router.globals.transitionHistory.peekTail().$from().name === 'app.gameplay'
        ) {
            this.initFromCache();
        } else {
            if (this.gamesFilterService.$gamesFilterSubsIsReady.getValue()) {
                this.setFilter();
            } else {
                this.gamesFilterService.$gamesFilterSubsIsReady
                    .pipe(
                        filter(v => !!v),
                        tap(() => {
                            setTimeout(() => {
                                this.setFilter();
                            }, 0);
                        }),
                        takeUntilDestroyed(this.destroyRef),
                    )
                    .subscribe();
            }
        }
    }

    protected setValueObservers(): void {
        this.merchants$ = this._merchants$.asObservable();
        this.categories$ = this._categories$.asObservable();
        this.filters$ = this._filters$.asObservable();
        this.chooseMerchant$ = this._chooseMerchant$.asObservable();
        this.chooseCategory$ = this._chooseCategory$.asObservable();
    }

    protected deleteFilter(): void {
        this.gamesFilterService.delete(this.props.searchFilterName, true);
    }
}
