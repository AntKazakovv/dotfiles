import {
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {
    TransitionService,
    RawParams,
} from '@uirouter/core';
import {
    AbstractComponent,
    ActionService,
    ConfigService,
    DeviceType,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {
    CategoryModel,
    IGameBlock,
    IGamesGridCParams,
} from 'wlc-engine/modules/games';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';

import * as Params from './games-catalog.params';

import _forEach from 'lodash-es/forEach';
import _get from 'lodash-es/get';
import _orderBy from 'lodash-es/orderBy';
import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-games-catalog]',
    templateUrl: './games-catalog.component.html',
    styleUrls: ['./styles/games-catalog.component.scss'],
})
export class GamesCatalogComponent extends AbstractComponent implements OnInit {

    public gameGrids: IGamesGridCParams[] = [];
    public isReady: boolean = false;
    public override $params: Params.IGamesCatalogCParams;

    protected isMobile: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IGamesCatalogCParams,
        protected gamesCatalogService: GamesCatalogService,
        configService: ConfigService,
        protected actionService: ActionService,
        protected translateService: TranslateService,
        protected transition: TransitionService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.isMobile = this.configService.get<boolean>('appConfig.mobile');
        this.initView();
        this.initEventHandlers();
    }

    protected async initView(): Promise<void> {
        this.isReady = false;
        this.gameGrids = [];

        await this.gamesCatalogService.ready;

        if (this.$params.showAllCategories) {
            const grids: IGamesGridCParams[] = [];

            _forEach(this.gamesCatalogService.getCategories(), (category: CategoryModel): void => {
                if (!category.games.length) {
                    return;
                }

                const gridParams: IGamesGridCParams = _merge(_cloneDeep(this.$params.gamesGridParams), {
                    title: category.title[this.translateService.currentLang] || category.title['en'],
                    byState: false,
                    filter: {
                        categories: [category.slug],
                    },
                });

                if (gridParams.showAllLink) {
                    gridParams.showAllLink = _merge(gridParams.showAllLink, {
                        sref: this.catalogSref(category),
                        params: this.catalogSrefParams(category),
                    });
                }

                if (gridParams.showAsSwiper) {
                    gridParams.showAsSwiper = _merge(gridParams.showAsSwiper, {
                        sliderParams: {
                            slideShowAll: {
                                sref: this.catalogSref(category),
                                srefParams: this.catalogSrefParams(category),
                            },
                        },
                    });
                }

                grids.push(gridParams);
            });

            this.gameGrids = grids;
        } else if (this.gamesCatalogService.getFundistCategorySettings()) {
            const category: CategoryModel = this.gamesCatalogService.getChildCategoryByState()
                || this.gamesCatalogService.getParentCategoryByState();

            await category?.isReady;

            if (category?.gameBlocks.length) {
                const grids: IGamesGridCParams[] = [];
                const gameBlocks = (category.view === 'restricted-blocks')
                    ? _orderBy(
                        category.gameBlocks, (gameBlock: IGameBlock) => _get(gameBlock, 'settings.order'),
                        'asc',
                    )
                    : category.gameBlocks;

                _forEach(gameBlocks, (gameBlock: IGameBlock, index) => {
                    if (category.view === 'restricted-blocks' && _get(gameBlock, 'settings.disable')) {
                        return;
                    }

                    const platformKey: string = this.isMobile ? 'mobile' : 'desktop';
                    const gameRows: number = _get(gameBlock, `settings.gameRows.${platformKey}`, 2);
                    const showType: string = _get(gameBlock, 'settings.showType');

                    const gridParams: IGamesGridCParams = {
                        customMod: 'games-block-' + index,
                        gamesRows: gameRows,
                        gamesList: gameBlock.games,
                        title: this.getCategoryTitle(gameBlock.category) + ' | ' + this.getCategoryTitle(category),
                        titleIcon: {
                            byCategory: true,
                        },
                        moreBtn: {
                            cardView: true,
                        },
                        category: gameBlock.category,
                        progressBar: {
                            prefixText: '',
                        },
                        btnLoadMore: {
                            common: {
                                text: gettext('Load more'),
                            },
                        },
                    };

                    if (showType === 'slide-arrows') {
                        gridParams.showAsSwiper = {
                            sliderParams: GlobalHelper.mergeConfig(
                                Params.sliderParams,
                                GlobalHelper.mergeConfig(
                                    this.$params.sliderParams || {},
                                    {
                                        swiper: {
                                            navigation: {
                                                nextEl: `.wlc-games-grid--games-block-${index} .wlc-swiper-button-next`,
                                                prevEl: `.wlc-games-grid--games-block-${index} .wlc-swiper-button-prev`,
                                            },
                                        },
                                    },
                                ),
                            ),
                        };
                    }
                    if (this.isMobile) {
                        gridParams.moreBtn.cardView = false;
                    }
                    grids.push(gridParams);
                });

                this.gameGrids = grids;
            }
        }

        this.isReady = true;
        this.cdr.detectChanges();
    }

    /**
     * Return title of category
     * @param category {CategoryModel}
     * @returns {string} category title
     */
    protected getCategoryTitle(category: CategoryModel): string {
        return category.title[this.translateService.currentLang] || this.translateService.instant(category.title['en']);
    }

    /**
     * Init event hanlers
     */
    protected initEventHandlers(): void {
        const successTransitionListener = this.transition.onSuccess({}, () => {
            this.initView();
        });

        this.$destroy.subscribe(() => {
            successTransitionListener();
        });

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                if (!type) {
                    return;
                }
                const isMobileNow = type !== DeviceType.Desktop;
                if (this.isMobile !== isMobileNow) {
                    this.isMobile = isMobileNow;
                    this.initView();
                }
            });
    }

    protected catalogSref(category: CategoryModel): string {
        return category.isParent ? 'app.catalog' : 'app.catalog.child';
    }

    protected catalogSrefParams(category: CategoryModel): RawParams {
        return {
            category: category.isParent ? category.slug : category.parentCategory.slug,
            childCategory: category.isParent ? null : category.slug,
        };
    }
}
