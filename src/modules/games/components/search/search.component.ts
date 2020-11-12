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

import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {
    ISearchParams,
    IFilterParams,
    PanelType,
    defaultParams,
    defaultGamesGridParams,
} from './search.params';
import {ConfigService} from 'wlc-engine/modules/core/services';
import {GamesCatalogService} from 'wlc-engine/modules/games/services';
import {
    ICategory,
    IMerchant,
} from 'wlc-engine/modules/games/interfaces/games.interfaces';
import {EventService} from 'wlc-engine/modules/core/services/event/event.service';
import {ILanguage} from 'wlc-engine/modules/core';
import {TranslateService} from '@ngx-translate/core';
import {IGamesGridCParams} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';
import {GamesFilterServiceEvents} from 'wlc-engine/modules/games/services/games-filter.service';

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
    public categories: ICategory[];
    public merchants: IMerchant[];

    public openPanel: PanelType;
    public filters: IFilterParams = {
        categories: [],
        merchants: [],
        search: '',
        favourites: false,
        latest: false,
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
        this.getMerchnats();

        this.initSearchListener();
    }

    public togglePanel(panel: PanelType): void {
        if (this.openPanel === panel) {
            this.openPanel = undefined;
        } else {
            this.openPanel = panel;
        }
    }

    // Interface only, Filter doesn't work, yet
    public chooseCategory(category?: ICategory): void {
        if (!category) {
            this.filters.categories.length = 0;
            return;
        }

        const catId = _toNumber(category.ID);

        if (this.filters.categories.includes(catId)) {
            this.filters.categories = _filter(
                this.filters.categories,
                (cat: number) => cat !== catId,
            );
        } else {
            this.filters.categories.push(catId);
        }
    }

    // Interface only, Filter doesn't work, yet
    public chooseMerchant(merchant?: IMerchant): void {
        if (!merchant) {
            this.filters.merchants.length = 0;
            return;
        }

        const merchId = _toNumber(merchant.ID);

        if (this.filters.merchants.includes(merchId)) {
            this.filters.merchants = _filter(
                this.filters.merchants,
                (merch: number) => merch !== merchId,
            );
        } else {
            this.filters.merchants.push(merchId);
        }

    }

    public isActive(filter: PanelType, id: number | string): boolean {
        return this.filters[filter].includes(_toNumber(id));
    }

    protected initSearchListener(): void {
        this.eventService.subscribe({
            name: GamesFilterServiceEvents.FILTER_SEARCH,
            from: 'modal',
        }, (data: string) => {this.filters.search = data;},
        this.$destroy);
    }

    protected getCategories(): void {
        // TODO must be avalable categories
        this.categories = this.gamesCatalogService.getCategories();
    }

    protected getMerchnats(): void {
        // TODO must be avalable merchants
        this.merchants = this.gamesCatalogService.getMerchants();
    }

}
