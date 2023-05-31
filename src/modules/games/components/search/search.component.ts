import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Inject,
} from '@angular/core';
import {
    trigger,
    style,
    animate,
    transition,
} from '@angular/animations';

import {
    Observable,
    Subscription,
} from 'rxjs';
import {
    takeUntil,
    first,
} from 'rxjs/operators';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ISearchCParams,
    PanelType,
    defaultParams,
    defaultGamesGridParams,
} from './search.params';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {TranslateService} from '@ngx-translate/core';
import {IGamesGridCParams} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {Game} from 'wlc-engine/modules/games/system/models';
import {
    GamesFilterService,
    GamesFilterServiceEvents,
} from 'wlc-engine/modules/games/system/services/games-filter.service';
import {IGamesFilterData} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';
import {ISearchFieldCParams} from 'wlc-engine/modules/games/components/search-field/search-field.params';

import _includes from 'lodash-es/includes';
import _filter from 'lodash-es/filter';
import _forEach from 'lodash-es/forEach';
import _uniqBy from 'lodash-es/uniqBy';
import _assignIn from 'lodash-es/assignIn';
import _sortBy from 'lodash-es/sortBy';
import _isEmpty from 'lodash-es/isEmpty';

@Component({
    selector: '[wlc-search]',
    templateUrl: './search.component.html',
    styleUrls: ['./styles/search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('openClose', [
            transition(':enter', [
                style({
                    opacity: 0,
                    height: 0,
                    paddingBottom: 0,
                }),
                animate('0.2s', style({
                    height: '*',
                    paddingBottom: '*',
                    opacity: 1,
                })),
            ]),
            transition(':leave', [
                animate('0.2s', style({
                    opacity: 0,
                    height: 0,
                    paddingBottom: 0,
                })),
            ]),
        ]),
    ],
})
export class SearchComponent extends AbstractComponent implements OnInit {
    public override $params: ISearchCParams;
    public categories: CategoryModel[];
    public merchants: MerchantModel[];

    public openPanel: PanelType;
    public filters: IGamesFilterData = {
        searchQuery: '',
        categories: [],
        merchants: [],
        excludeCategories: [],
        excludeMerchants: [],
    };
    public currentLanguage: string;
    public gamesGridParams: IGamesGridCParams;
    public searchFieldCParams: ISearchFieldCParams;
    public searchQuery: string = '';
    public fieldWasClicked: boolean = false;
    public lastQueries$: Observable<string[]>;
    public visibleGames: Game[] = [];
    public ready: boolean = false;

    protected parentCategory: CategoryModel;
    protected childCategory: CategoryModel;
    protected selectedCategories: CategoryModel[] = [];
    protected selectedMerchants: MerchantModel[] = [];

    constructor(
        @Inject('injectParams') protected injectParams: ISearchCParams,
        configService: ConfigService,
        protected gamesCatalogService: GamesCatalogService,
        cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected translateService: TranslateService,
        protected gamesFilterService: GamesFilterService,
    ) {
        super({
            injectParams: injectParams,
            defaultParams: defaultParams,
        }, configService, cdr);

        this.currentLanguage = this.translateService.currentLang;
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        await this.gamesCatalogService.ready;
        if (this.$params.theme === 'easy') {
            this.lastQueries$ = this.gamesFilterService.lastQueries$;
            this.gamesGridParams = this.$params.easyThemeParams.searchGamesGrid;
            const {hideOnFindGames, swiperOptionsOnHideSecondBlock} = this.$params.easyThemeParams.secondBlock;

            if (hideOnFindGames) {
                this.gamesGridParams.showAsSwiper = swiperOptionsOnHideSecondBlock;
                this.$params.easyThemeParams.secondBlock.gamesGrid.showAsSwiper = swiperOptionsOnHideSecondBlock;
            }
        } else {
            this.gamesGridParams = _assignIn(
                {},
                defaultGamesGridParams,
                this.$params.common?.gamesGridParams,
            );

            this.searchFieldCParams = {
                searchQueryFromCache: this.searchQuery,
                searchFrom: this.gamesGridParams.searchFilterName,
                focus: true,
            };
            this.initFromCache();
        }

        if (this.$params.common?.openProvidersList) {
            this.togglePanel('merchants');
        }
        this.parentCategory = this.gamesCatalogService.getParentCategoryByState();
        this.childCategory = this.gamesCatalogService.getChildCategoryByState();

        this.getCategories();
        this.getMerchants();
        this.initSearchListener();
        this.initActiveFilters();

        this.eventService.subscribe(
            {name: 'CLOSE_MODAL'},
            (modalId: string) => {
                if (modalId !== 'search') {
                    return;
                }

                this.gamesFilterService.delete(this.gamesGridParams.searchFilterName, true);
            },
            this.$destroy,
        );

        this.ready = true;
        this.cdr.detectChanges();
    }

    public togglePanel(panel: PanelType): void {
        if (this.openPanel === panel) {
            this.openPanel = undefined;
        } else {
            this.openPanel = panel;
        }
    }

    public chooseCategory(category?: CategoryModel): void {
        if (!category) {
            const hasCurrentCategories = this.filters.categories.length;

            this.filters.categories = [];
            this.selectedCategories = [];
            this.getMerchants();
            if (hasCurrentCategories) {
                this.setFilter();
            }
            return;
        }

        const catId = category.slug;
        if (_includes(this.filters.categories, catId)) {
            this.filters.categories = _filter(
                this.filters.categories,
                (cat: string) => cat !== catId,
            );
        } else {
            this.filters.categories.push(catId);
        }

        if (this.filters.categories.length) {
            this.selectedCategories = _filter(this.categories, (category: CategoryModel) => {
                return _includes(this.filters.categories, category.slug);
            });

            let merchantsList: MerchantModel[] = [];
            _forEach(this.selectedCategories, (category) => {
                merchantsList = merchantsList.concat(category.merchants);
            });
            this.merchants = _sortBy(_uniqBy(merchantsList, 'id'), (merchant) => {
                return merchant.name;
            });
        } else {
            this.getMerchants();
        }
        this.setFilter();
    }

    public chooseMerchant(merchant?: MerchantModel): void {
        if (!merchant) {
            const hasCurrentMerchant = this.filters.merchants.length;

            this.filters.merchants = [];
            this.selectedMerchants = [];
            this.getCategories();
            if (hasCurrentMerchant) {
                this.setFilter();
            }
            return;
        }

        const merchId = merchant.id;
        if (_includes(this.filters.merchants, merchId)) {
            this.filters.merchants = _filter(
                this.filters.merchants,
                (merch: number) => merch !== merchId,
            );
        } else {
            this.filters.merchants.push(merchId);
        }

        if (this.filters.merchants.length) {
            this.selectedMerchants = _filter(this.merchants, (merchant: MerchantModel) => {
                return _includes(this.filters.merchants, merchant.id);
            });
            this.categories = _filter(this.gamesCatalogService.getCategoriesForFilter(), (category) => {
                return category.hasSomeMerchant(this.selectedMerchants);
            });
        } else {
            this.getCategories();
        }
        this.setFilter();
    }

    public isActive(filter: PanelType, id: number | string): boolean {
        return _includes(this.filters[filter], id);
    }

    /**
     * Handle on input in search field component
     * @param query string
     */
    public setSearchQuery(query: string): void {
        this.searchQuery = query;

        if (this.$params.theme === 'easy') {
            this.setFilteredGames(query);
        } else {
            this.setFilter();
        }
    }

    /**
     * Add query in history
     * @param query string
     * @param delay number
     */
    public addLastQueries(query: string, delay: number = 0): void {
        setTimeout((): void => {
            this.gamesFilterService.setLastQuery(query);
        }, delay);
    }

    /**
     * Remove query from history by index
     * @param event MouseEvent
     * @param index number
     */
    public deleteQuery(event: MouseEvent, index: number): void {
        event.stopPropagation();
        this.gamesFilterService.deleteQuery(index);
    }

    /**
     * Choose query from history by index
     * @param index number
     */
    public chooseQuery(index: number): void {
        this.lastQueries$
            .pipe(
                first(),
                takeUntil(this.$destroy),
            )
            .subscribe((data: string[]): void => {
                const query = data[index];

                if (!query || this.searchQuery === query) {
                    return;
                }

                this.searchQuery = query;
                this.handleClickSearchField();
                this.addLastQueries(query);
            });
    }

    /**
     * Click handler in input search field
     */
    public handleClickSearchField(): void {
        this.fieldWasClicked = true;
    }

    /**
     * Show second block if hideOnFindGames falsy and there is no founded games
     * Or show second block if hideOnFindGames truthy
     */
    public get showSecondBlock(): boolean {
        return !this.$params.easyThemeParams.secondBlock.hideOnFindGames
            || this.$params.easyThemeParams.secondBlock.hideOnFindGames
            && !this.visibleGames.length;
    }

    protected setFilteredGames(query: string): void {
        this.visibleGames = this.gamesCatalogService.searchByQuery(
            query,
            this.$params.easyThemeParams.showMerchantsFirst,
        );
    }

    protected initActiveFilters(): void {
        const activeCategory = this.childCategory || this.parentCategory;

        if (this.filters.categories.length) {
            return;
        }

        if (activeCategory) {
            this.chooseCategory(activeCategory);
        }
    }

    protected initSearchListener(): void {
        this.eventService.subscribe({
            name: GamesFilterServiceEvents.FILTER_SEARCH,
            from: this.gamesGridParams.searchFilterName,
        }, (data: IGamesFilterData) => {
            this.filters.searchQuery = data.searchQuery;
        }, this.$destroy);
    }

    protected getCategories(): void {
        this.categories = _uniqBy(this.gamesCatalogService.getCategoriesForFilter(), (item) => item.id);
    }

    protected getMerchants(): void {
        const category = this.childCategory || this.parentCategory;
        let merchants;
        if (category && this.selectedCategories.length) {
            merchants = category.merchants;
        } else {
            merchants = this.gamesCatalogService.getFilteredMerchants();
        }

        this.merchants = _sortBy(merchants, (merchant) => {
            return merchant.alias;
        });
    }

    /**
     * If there is a cached filter, the method initializes the component with this filter
     */
    protected initFromCache(): void {
        const filterCache: IGamesFilterData = _isEmpty(this.gamesFilterService.filterCache)
            ? null : this.gamesFilterService.filterCache[this.gamesGridParams.searchFilterName];

        const isReady: Subscription = this.gamesFilterService.$gamesFilterSubsIsReady.subscribe((): void => {
            setTimeout(() => {
                if (!filterCache) {
                    this.setFilter();
                } else {
                    this.filters = {...filterCache};
                    this.searchQuery = this.filters.searchQuery;
                    this.gamesFilterService.set(this.gamesGridParams.searchFilterName, filterCache, true);
                }
            }, 0);
            isReady.unsubscribe();
        });
    }

    protected setFilter(): void {
        this.gamesFilterService.set(this.gamesGridParams.searchFilterName, this.filters, true);
    }
}
