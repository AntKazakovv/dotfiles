import {
    Input,
    Inject,
    OnInit,
    Component,
} from '@angular/core';

import {
    ConfigService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {MerchantModel} from 'wlc-engine/modules/games';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services';
import {IconListAbstract} from 'wlc-engine/modules/core/system/classes/icon-list-abstract.class';

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

    public $params: Params.IIconMerchantsListCParams;

    protected merchants: MerchantModel[];
    protected gamesCatalogService: GamesCatalogService;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IIconMerchantsListCParams,
        protected configService: ConfigService,
        protected injectionService: InjectionService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.gamesCatalogService = await this.injectionService
            .getService<GamesCatalogService>('games.games-catalog-service');

        await this.gamesCatalogService.ready;
        this.getMerchantsList();
        this.$params.iconComponentParams.items =
            this.prepareIconsParams('merchants', this.$params.iconComponentParams, this.merchants);
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
