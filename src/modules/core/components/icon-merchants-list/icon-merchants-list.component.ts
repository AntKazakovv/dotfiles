import {
    Input,
    Inject,
    OnInit,
    Component,
    ChangeDetectorRef,
} from '@angular/core';

import {
    ConfigService,
    EventService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {MerchantModel} from 'wlc-engine/modules/games';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services';
import {IconListAbstract} from 'wlc-engine/modules/core/system/classes/icon-list-abstract.class';
import {IconModel} from 'wlc-engine/modules/core/system/models/icon-list-item.model';

import * as Params from './icon-merchants-list.params';

import _find from 'lodash-es/find';
import _each from 'lodash-es/each';
import _filter from 'lodash-es/filter';
import _includes from 'lodash-es/includes';
import _sortedUniqBy from 'lodash-es/sortedUniqBy';

@Component({
    selector: '[wlc-icon-merchants-list]',
    templateUrl: './icon-merchants-list.component.html',
})
export class IconMerchantsListComponent extends IconListAbstract<Params.IIconMerchantsListCParams> implements OnInit {
    @Input() public inlineParams: Params.IIconMerchantsListCParams;

    public items: IconModel[] = [];
    public $params: Params.IIconMerchantsListCParams;

    protected merchants: MerchantModel[];
    protected gamesCatalogService: GamesCatalogService;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IIconMerchantsListCParams,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected injectionService: InjectionService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, eventService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.gamesCatalogService = await this.injectionService
            .getService<GamesCatalogService>('games.games-catalog-service');
        await this.gamesCatalogService.ready;

        this.getMerchantsList();

        if (this.configService.get<boolean>('$base.colorThemeSwitching.use')
        && this.$params.colorIconBg && this.$params.iconsType === 'color') {
            this.subscribeOnToggleSiteTheme(() => this.setItemsList());
        }

        this.setItemsList();
    }

    /**
     * sets items list and then pass it to icon list component and render them
     */
    protected setItemsList(): void {
        const {iconsType, colorIconBg} = this.$params;
        const showIconAs = iconsType === 'black' ? 'svg' : 'img';

        this.items = this.convertItemsToIconModel<MerchantModel>(
            this.merchants,
            (item) => {
                return {
                    from: {
                        component: 'IconMerchantsListComponent',
                        method: 'setItemsList',
                    },
                    icon: this.merchantsPaymentsIterator('merchants', {
                        showAs: showIconAs,
                        wlcElement: item.wlcElement,
                        nameForPath: item.alias,
                        alt: item.name,
                        colorIconBg,
                    }),
                };
            },
        );

        this.cdr.markForCheck();
    }

    /**
     * Get merchants list array from app config
     *
     * @returns {void}
     **/
    protected getMerchantsList(): void {
        this.merchants = _sortedUniqBy(this.gamesCatalogService.getAvailableMerchants(),
            (item: MerchantModel) => item.name);
        this.updateList();
    }

    /**
     * Update icon list array by include && exclude params
     *
     * @returns {void}
     **/
    protected updateList(): void {
        if (this.$params.exclude?.includes('all')) {
            this.merchants = [];
        } else {
            this.merchants = _filter(this.merchants, (item: MerchantModel) =>
                !_includes(this.$params.exclude, item.name.toLocaleLowerCase()));
        }

        _each(this.$params.include, (name) => {
            if (!_find(this.merchants, (item: MerchantModel) => item.name.toLocaleLowerCase() === name)) {
                const merchantByName = this.gamesCatalogService.getMerchantByName(name);
                this.merchants.push(merchantByName);
            }
        });
    }
}
