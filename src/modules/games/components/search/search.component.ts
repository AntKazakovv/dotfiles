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
import {ConfigService} from 'wlc-engine/modules/core/system/services';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services';
import {
    IMerchant,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ILanguage} from 'wlc-engine/modules/core';
import {TranslateService} from '@ngx-translate/core';
import {IGamesGridCParams} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {
    GamesFilterService,
    GamesFilterServiceEvents,
} from 'wlc-engine/modules/games/system/services/games-filter.service';
import {IGamesFilterData} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';

import {
    filter as _filter,
    find as _find,
    assignIn as _assignIn,
    includes as _includes,
} from 'lodash-es';

@Component({
    selector: '[wlc-search]',
    templateUrl: './search.component.html',
    styleUrls: ['./styles/search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('openClose', [
            transition(':enter', [
                style({opacity: 0, height: '0px', padding: 0}),
                animate('0.2s', style({height: '*', padding: '*'})),
                animate('0.2s', style({opacity: 1})),
            ]),
            transition(':leave', [
                animate('0.2s', style({opacity: 0, height: '0px', padding: 0})),
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
    public currentLanguage: ILanguage;
    public gamesGridParams: IGamesGridCParams;
    public searchQuery: string;

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

        this.currentLanguage = _find(this.configService.get<ILanguage[]>('appConfig.languages'), {
            code: this.translate.currentLang,
        });
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.gamesGridParams = _assignIn(
            {},
            defaultGamesGridParams,
            {
                showTitle: false,
            },
            this.$params.gamesGridParams,
        );

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
            this.setFilter();
            return;
        }

        const catId = category.menuId;
        if (_includes(this.filters.categories, catId)) {
            this.filters.categories = _filter(
                this.filters.categories,
                (cat: string) => cat !== catId,
            );
        } else {
            this.filters.categories.push(catId);
        }
        this.setFilter();
    }

    public chooseMerchant(merchant?: MerchantModel): void {
        if (!merchant) {
            this.filters.merchants = [];
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
        this.setFilter();
    }

    public isActive(filter: PanelType, id: number | string): boolean {
        return _includes(this.filters[filter], id);
    }

    public setSearchQuery(query): void {
        this.searchQuery = query;
    }

    protected initActiveFilters(): void {
        const activeCategory = this.gamesCatalogService.getParentCategoryByState();
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
        this.categories = this.gamesCatalogService.getCategories();
    }

    protected getMerchants(): void {
        this.merchants = this.gamesCatalogService.getAvailableMerchants();
    }

    protected setFilter(): void {
        this.gamesFilterService.set(this.gamesGridParams.searchFilterName, this.filters);
    }
}
