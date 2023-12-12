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
import {TranslateService} from '@ngx-translate/core';

import {
    AbstractComponent,
    ConfigService,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {
    CategoryModel,
    MerchantModel,
} from 'wlc-engine/modules/games';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {IGamesGridCParams} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';
import {IconModel} from 'wlc-engine/modules/icon-list/system/models/icon-list-item.model';

import * as Params from './provider-games.params';

import _filter from 'lodash-es/filter';
import _isEmpty from 'lodash-es/isEmpty';
import _cloneDeep from 'lodash-es/cloneDeep';
import _merge from 'lodash-es/merge';

@Component({
    selector: '[wlc-provider-games]',
    templateUrl: './provider-games.component.html',
    styleUrls: ['./styles/provider-games.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProviderGamesComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IProviderGamesCParams;

    public override $params: Params.IProviderGamesCParams;

    public provider: MerchantModel;
    public icon: IconModel;
    public ready: boolean = false;
    public error: boolean = false;
    public gamesGridList: IGamesGridCParams[] = [];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IProviderGamesCParams,
        configService: ConfigService,
        protected uiRouter: UIRouterGlobals,
        protected router: UIRouter,
        protected gamesCatalogService: GamesCatalogService,
        protected translateService: TranslateService,
        protected stateService: StateService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
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
        let categories = this.gamesCatalogService.getCategoriesByMerchatName(this.provider.name);
        const selectedCategory: string = this.router.globals.params['childCategory']
            || this.router.globals.params['category'];

        if (selectedCategory) {
            categories = _filter(categories, {'slug': selectedCategory});
        }

        if (_isEmpty(categories)) {
            this.gamesGridList.push({
                ...this.$params.gamesGridAllParams,
                filter: {
                    merchants: [this.provider.id],
                },
            });
        } else {

            this.gamesGridList = categories.map((category: CategoryModel): IGamesGridCParams => {

                let gamesGridParams = _cloneDeep(this.$params.gamesGridCategoryParams);

                if (this.$params.type === 'mobile-app') {
                    const categoryModel = this.gamesCatalogService.getCategoryBySlug(category.slug);

                    if (categoryModel) {
                        let sref: string = '',
                            category: string = '',
                            childCategory: string = '';

                        if (!categoryModel.isParent) {
                            sref = 'app.catalog.child';
                            category = categoryModel.parentCategory.slug;
                            childCategory = categoryModel.slug;
                        } else {
                            sref = 'app.catalog';
                            category = categoryModel.slug;
                        }

                        if (gamesGridParams.showAllLink.use) {
                            if (!gamesGridParams.showAllLink.params) {
                                gamesGridParams.showAllLink.params = {};
                            }

                            gamesGridParams.showAllLink.params = _merge(
                                gamesGridParams.showAllLink.params,
                                this.router.globals.params,
                            );

                            if (!gamesGridParams.showAllLink.sref) {
                                gamesGridParams.showAllLink.sref = sref;
                            }
                            gamesGridParams.showAllLink.params.category = category;
                            gamesGridParams.showAllLink.params.childCategory = childCategory;
                        }

                        if (gamesGridParams.showAsSwiper?.sliderParams?.slideShowAll) {

                            if (!gamesGridParams.showAsSwiper.sliderParams.slideShowAll.sref) {
                                gamesGridParams.showAsSwiper.sliderParams.slideShowAll.sref = sref;
                            }

                            gamesGridParams.showAsSwiper.sliderParams.slideShowAll.srefParams = {
                                category: category,
                                childCategory: childCategory,
                            };
                        }
                    }
                }

                return {
                    ...gamesGridParams,
                    filter: {
                        categories: [category.slug],
                        merchants: [this.provider.id],
                    },
                };
            });
        }

        this.ready = true;
        this.cdr.markForCheck();
    }

    protected setIconModel(): void {
        const {alias, wlcElement} = this.provider;
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
                alt: alias,
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
