import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Inject,
    OnDestroy,
} from '@angular/core';
import {
    trigger,
    style,
    animate,
    transition,
} from '@angular/animations';

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
import {
    GamesFilterService,
    GamesFilterServiceEvents,
} from 'wlc-engine/modules/games/system/services/games-filter.service';
import {IGamesFilterData} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';

import _includes from 'lodash-es/includes';
import _filter from 'lodash-es/filter';
import _forEach from 'lodash-es/forEach';
import _uniqBy from 'lodash-es/uniqBy';
import _assignIn from 'lodash-es/assignIn';
import _sortBy from 'lodash-es/sortBy';

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
export class SearchComponent extends AbstractComponent implements OnInit, OnDestroy {
    public $params: ISearchCParams;
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
    public searchQuery: string;

    protected parentCategory: CategoryModel;
    protected childCategory: CategoryModel;
    protected selectedCategories: CategoryModel[] = [];
    protected selectedMerchants: MerchantModel[] = [];

    constructor(
        @Inject('injectParams') protected injectParams: ISearchCParams,
        protected configService: ConfigService,
        protected gamesCatalogService: GamesCatalogService,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected translate: TranslateService,
        protected gamesFilterService: GamesFilterService,
    ) {
        super({
            injectParams: injectParams,
            defaultParams: defaultParams,
        }, configService);

        this.currentLanguage = this.translate.currentLang;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.gamesGridParams = _assignIn(
            {},
            defaultGamesGridParams,
            {
                showTitle: false,
            },
            this.$params.common?.gamesGridParams,
        );
        if (this.$params.common?.openProvidersList) {
            this.togglePanel('merchants');
        }
        this.parentCategory = this.gamesCatalogService.getParentCategoryByState();
        this.childCategory = this.gamesCatalogService.getChildCategoryByState();

        this.getCategories();
        this.getMerchants();
        this.initSearchListener();
        this.setFilter();
        this.initActiveFilters();
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
            this.filters.categories = [];
            this.selectedCategories = [];
            this.getMerchants();
            this.setFilter();
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
            this.filters.merchants = [];
            this.selectedMerchants = [];
            this.getCategories();
            this.setFilter();
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

    public setSearchQuery(query): void {
        this.searchQuery = query;
    }

    protected initActiveFilters(): void {
        const activeCategory = this.childCategory || this.parentCategory;
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
        },
        this.$destroy);
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

    protected setFilter(): void {
        this.gamesFilterService.set(this.gamesGridParams.searchFilterName, this.filters);
    }
}
