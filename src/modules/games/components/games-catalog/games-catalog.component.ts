import {
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {TransitionService} from '@uirouter/core';
import {
    AbstractComponent,
    ActionService,
    ConfigService,
    DeviceType,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {
    CategoryModel,
    GamesCatalogService,
    IGameBlock,
    IGamesGridCParams,
} from 'wlc-engine/modules/games';

import * as Params from './games-catalog.params';

import _forEach from 'lodash-es/forEach';
import _get from 'lodash-es/get';
import _orderBy from 'lodash-es/orderBy';

@Component({
    selector: '[wlc-games-catalog]',
    templateUrl: './games-catalog.component.html',
    styleUrls: ['./styles/games-catalog.component.scss'],
})
export class GamesCatalogComponent extends AbstractComponent implements OnInit {

    public gameGrids: IGamesGridCParams[] = [];
    public isReady: boolean = false;
    public $params: Params.IGamesCatalogCParams;

    protected isMobile: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IGamesCatalogCParams,
        protected gamesCatalogService: GamesCatalogService,
        protected configService: ConfigService,
        protected actionService: ActionService,
        protected translateService: TranslateService,
        protected transition: TransitionService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.isMobile = this.configService.get<boolean>('appConfig.mobile');
        this.initView();
        this.initEventHandlers();
    }

    protected async initView(): Promise<void> {
        this.isReady = false;
        this.gameGrids = [];

        if (this.configService.get('appConfig.categories')) {
            const category: CategoryModel = this.gamesCatalogService.getChildCategoryByState() || this.gamesCatalogService.getParentCategoryByState();

            await category?.isReady;

            if (category?.gameBlocks.length) {
                const grids: IGamesGridCParams[] = [];
                const gameBlocks = (category.view === 'restricted-blocks')
                    ? _orderBy(category.gameBlocks, (gameBlock: IGameBlock) => _get(gameBlock, 'settings.order'), 'asc')
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

            this.isReady = true;
            this.cdr.detectChanges();
        }
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
        const successTransitionListener = this.transition.onSuccess({}, (transition) => {
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
}
