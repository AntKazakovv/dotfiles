import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {
    StateService,
    UIRouter,
    UIRouterGlobals,
} from '@uirouter/core';

import {
    AbstractComponent,
    ConfigService,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {GamesHelper} from 'wlc-engine/modules/games/system/helpers/games.helpers';
import {
    MerchantModel,
} from 'wlc-engine/modules/games';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {IGamesGridCParams} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';
import {IByMerchantItemCategory} from 'wlc-engine/modules/games/system/interfaces';
import {IconModel} from 'wlc-engine/modules/core/system/models/icon-list-item.model';

import * as Params from './provider-games.params';

import _get from 'lodash-es/get';
import _values from 'lodash-es/values';
import _orderBy from 'lodash-es/orderBy';
import _isEmpty from 'lodash-es/isEmpty';

@Component({
    selector: '[wlc-provider-games]',
    templateUrl: './provider-games.component.html',
    styleUrls: ['./styles/provider-games.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProviderGamesComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IProviderGamesCParams;

    public $params: Params.IProviderGamesCParams;

    public provider: MerchantModel;
    public icon: IconModel;
    public ready: boolean = false;
    public error: boolean = false;
    public gamesGridList: IGamesGridCParams[] = [];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IProviderGamesCParams,
        protected configService: ConfigService,
        protected uiRouter: UIRouterGlobals,
        protected router: UIRouter,
        protected gamesCatalogService: GamesCatalogService,
        protected stateService: StateService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.getProviderByState();
        this.initListeners();
    }

    protected async getProviderByState(): Promise<void> {
        await this.gamesCatalogService.ready;

        if (this.provider) {
            this.removeModifiers(this.provider.menuId);
        }

        const slug = this.uiRouter.params['provider'];

        this.provider = slug ? this.gamesCatalogService.getMerchantByName(slug) : null;

        if (!slug || !this.provider) {
            this.stateService.go('app.error', {
                locale: this.configService.get('currentLanguage'),
            });
            return;
        }

        this.setIconModel();
        this.addModifiers(this.provider.menuId);
        this.createGamesGridList();
    }

    protected createGamesGridList(): void {
        const cats = GamesHelper.getCategoriesByMerchant(this.provider.name.toLowerCase());

        if (_isEmpty(cats)) {
            this.gamesGridList.push({
                ...this.$params.gamesGridAllParams,
                filter: {
                    merchants: [this.provider.id],
                },
            });
        } else {
            this.gamesGridList = _orderBy(_values(cats), 'sort', 'desc').map((cat: IByMerchantItemCategory) => {
                return {
                    ...this.$params.gamesGridCategoryParams,
                    filter: {
                        categories: [cat.slug],
                        merchants: [this.provider.id],
                    },
                };
            });
        }

        this.ready = true;
        this.cdr.markForCheck();
    }

    protected setIconModel(): void {
        const {name, alias, wlcElement} = this.provider;
        const {iconType, colorIconBg} = this.$params;
        const showAs = iconType === 'black' ? 'svg' : 'img';
        const iconColor = (iconType === 'color' && colorIconBg) ? '/' + colorIconBg : null;
        const iconPath = `/merchants/svg/${iconType}${iconColor || ''}/${GlobalHelper.toSnakeCase(alias)}.svg`;
        this.icon = new IconModel(
            {
                component: 'ProviderGamesComponent',
                method: 'setIconModel',
            },
            {
                showAs: showAs,
                alt: name,
                wlcElement: wlcElement,
                iconUrl: `${showAs === 'img' ? '/gstatic' : ''}${iconPath}`,
            },
        );
    }

    protected initListeners(): void {
        this.router.transitionService.onSuccess({}, (trans) => {
            this.ready = false;
            this.cdr.markForCheck();
            if (trans.params().provider) {
                this.getProviderByState();
            }
        });
    }

}
