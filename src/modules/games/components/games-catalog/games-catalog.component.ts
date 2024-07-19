import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {
    filter,
    takeUntil,
} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {
    RawParams,
} from '@uirouter/core';
import _forEach from 'lodash-es/forEach';
import _get from 'lodash-es/get';
import _orderBy from 'lodash-es/orderBy';
import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
    AbstractComponent,
    ActionService,
    DeviceType,
    GlobalHelper,
    RouterService,
    TLifecycleEvent,
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

@Component({
    selector: '[wlc-games-catalog]',
    templateUrl: './games-catalog.component.html',
    styleUrls: ['./styles/games-catalog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesCatalogComponent extends AbstractComponent implements OnInit {

    public gameGrids: IGamesGridCParams[] = [];
    public isReady: boolean = false;
    public override $params: Params.IGamesCatalogCParams;

    protected isMobile: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IGamesCatalogCParams,
        protected gamesCatalogService: GamesCatalogService,
        protected actionService: ActionService,
        protected translateService: TranslateService,
        protected routerService: RouterService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.isMobile = this.configService.get<boolean>('appConfig.mobile');
        this.initView();
        this.initEventHandlers();
    }

    protected async initView(): Promise<void> {
        const grids: IGamesGridCParams[] = [];
        const category: CategoryModel = this.gamesCatalogService.getChildCategoryByState()
            || this.gamesCatalogService.getParentCategoryByState();

        this.isReady = false;
        this.gameGrids = [];

        await this.gamesCatalogService.ready;

        if (this.$params.showAllCategories) {
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

            await category?.isReady;
            if (category?.gameBlocks.length) {
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
                    const cardView: boolean = showType === 'btn-load-more';

                    const gridParams: IGamesGridCParams = _merge(_cloneDeep(this.$params.gamesGridParams), {
                        customMod: 'games-block-' + index,
                        gamesRows: gameRows,
                        gamesList: gameBlock.games,
                        title: this.getCategoryTitle(gameBlock.category) + ' | ' + this.getCategoryTitle(category),
                        titleIcon: {
                            byCategory: true,
                        },
                        moreBtn: {
                            cardView: cardView,
                        },
                        category: gameBlock.category,
                        openContext: gameBlock.category.slug + ' | ' + category.slug,
                        progressBar: {
                            prefixText: '',
                        },
                        btnLoadMore: {
                            common: {
                                text: gettext('Show more'),
                            },
                        },
                    });

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

                    if (this.isMobile && this.$params.gamesGridParams.theme !== 'wolf') {
                        gridParams.moreBtn.cardView = false;
                    }

                    grids.push(gridParams);
                });
            } else {
                const gridParams: IGamesGridCParams = _merge(_cloneDeep(this.$params.gamesGridParams), {
                    openContext: category.slug,
                });
                grids.push(gridParams);
            }

            this.gameGrids = grids;
        } else {
            const gridParams: IGamesGridCParams = _merge(_cloneDeep(this.$params.gamesGridParams), {
                openContext: category.slug,
            });
            grids.push(gridParams);
            this.gameGrids = grids;
        }
        this.isReady = true;
        this.cdr.markForCheck();
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
        this.routerService.events$.pipe(
            filter((event: TLifecycleEvent) => event.name === 'onSuccess'),
            takeUntil(this.$destroy),
        ).subscribe(() => {
            this.initView();
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
