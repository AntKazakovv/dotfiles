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
    ISearchParams,
    PanelType,
    defaultParams,
    defaultGamesGridParams,
} from './search.params';
import {ConfigService} from 'wlc-engine/modules/core/system/services';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services';
import {
    ICategory,
    IMerchant,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ILanguage} from 'wlc-engine/modules/core';
import {TranslateService} from '@ngx-translate/core';
import {IGamesGridCParams} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {GamesFilterService, GamesFilterServiceEvents} from 'wlc-engine/modules/games/system/services/games-filter.service';
import {IGamesFilterData} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';

import {
    filter as _filter,
    toNumber as _toNumber,
    find as _find,
    assignIn as _assignIn,
} from 'lodash';

@Component({
    selector: '[wlc-search]',
    templateUrl: './search.component.html',
    styleUrls: ['./styles/search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('openClose', [
            transition(':enter', [
                style({ opacity: 0, height: '0px' }),
                animate('0.2s', style({ opacity: 1, height: '*' })),
            ]),
            transition(':leave', [
                animate('0.2s', style({ opacity: 0, height: '0px' })),
            ]),
        ]),
    ],
})
export class SearchComponent extends AbstractComponent implements OnInit, OnDestroy {
    public $params: ISearchParams;
    public categories: CategoryModel[];
    public merchants: IMerchant[];

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

    constructor(
        @Inject('injectParams') protected injectParams: ISearchParams,
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
            this.$params.gamesGridParams,
        );

        this.getCategories();
        this.getMerchants();

        this.initSearchListener();
        this.setFilter();
    }

    public togglePanel(panel: PanelType): void {
        if (this.openPanel === panel) {
            this.openPanel = undefined;
        } else {
            this.openPanel = panel;
        }
    }

    // Interface only, Filter doesn't work, yet
    public chooseCategory(category?: CategoryModel): void {
        if (!category) {
            this.filters.categories = [];
            return;
        }

        const catId = category.menuId;

        if (this.filters.categories.includes(catId)) {
            this.filters.categories = _filter(
                this.filters.categories,
                (cat: string) => cat !== catId,
            );
        } else {
            this.filters.categories.push(catId);
        }
        this.setFilter();
    }

    // Interface only, Filter doesn't work, yet
    public chooseMerchant(merchant?: IMerchant): void {
        if (!merchant) {
            this.filters.merchants = [];
            return;
        }

        const merchId = merchant.ID.toString();

        if (this.filters.merchants.includes(merchId)) {
            this.filters.merchants = _filter(
                this.filters.merchants,
                (merch: string) => merch !== merchId,
            );
        } else {
            this.filters.merchants.push(merchId);
        }
        this.setFilter();
    }

    public isActive(filter: PanelType, id: number | string): boolean {
        return this.filters[filter].includes(id.toString());
    }

    protected initSearchListener(): void {
        this.eventService.subscribe({
            name: GamesFilterServiceEvents.FILTER_SEARCH,
            from: this.gamesGridParams.searchFilterName,
        }, (data: IGamesFilterData) => {this.filters.searchQuery = data.searchQuery;},
        this.$destroy);
    }

    protected getCategories(): void {
        this.categories = this.gamesCatalogService.getAvailableCategories();
    }

    protected getMerchants(): void {
        this.merchants = this.gamesCatalogService.getAvailableMerchants();
    }

    protected setFilter(): void {
        this.gamesFilterService.set(this.gamesGridParams.searchFilterName, this.filters);
    }
}
