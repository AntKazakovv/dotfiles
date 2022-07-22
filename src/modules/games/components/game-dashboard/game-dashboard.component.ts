import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    Input,
    OnChanges,
    OnInit,
    Renderer2,
    SimpleChanges,
    ViewChild,
    TemplateRef,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import {FormControl} from '@angular/forms';

import {
    BehaviorSubject,
    fromEvent,
} from 'rxjs';
import {
    first,
    takeUntil,
} from 'rxjs/operators';
import _get from 'lodash-es/get';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';
import _map from 'lodash-es/map';

import {HammerConfig} from 'wlc-engine/modules/core/system/config/hammer.config';
import {
    ActionService,
    ConfigService,
    DeviceType,
    DeviceOrientation,
    EventService,
    IIndexing,
    IWrapperCParams,
    ICheckboxCParams,
    AbstractComponent,
    CachingService,
    IResizeEvent,
    AppType,
} from 'wlc-engine/modules/core';
import {
    ISlide,
    ISliderCParams,
} from 'wlc-engine/modules/promo';
import {
    IUserStatsCParams,
    UserProfile,
} from 'wlc-engine/modules/user';
import * as componentLib from 'wlc-engine/modules/core/system/config/layouts/components';
import {DashboardSide} from 'wlc-engine/modules/games/components/game-dashboard/game-dashboard.params';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {GameThumbComponent} from 'wlc-engine/modules/games/components/game-thumb/game-thumb.component';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './game-dashboard.params';

enum Direction {
    Left = 'left',
    Right = 'right',
}

interface IPanEventOptions {
    disableDirection: Direction;
}

@Component({
    selector: '[wlc-game-dashboard]',
    templateUrl: './game-dashboard.component.html',
    styleUrls: ['./styles/game-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('leftShift', [
            state('hidden', style({
                transform: 'translateX(-100%) scale(-1, 1)',
            })),
            state('shown', style({
                transform: 'translateX(0) scale(-1, 1)',
            })),
            transition('hidden => shown', [
                animate('0.5s'),
            ]),
        ]),
        trigger('rightShift', [
            state('hidden', style({
                transform: 'translateX(100%) scale(-1, 1)',
            })),
            state('shown', style({
                transform: 'translateX(0) scale(-1, 1)',
            })),
            transition('hidden => shown', [
                animate('0.5s'),
            ]),
        ]),
        trigger('fadeIn', [
            state('hidden', style({
                opacity: '0',
            })),
            state('shown', style({
                opacity: '1',
            })),
            transition('hidden => shown', [
                animate('0.5s'),
            ]),
        ]),
    ],
})
export class GameDashboardComponent extends AbstractComponent implements OnInit, OnChanges, AfterViewInit {
    @ViewChild('bonuses') bonusesTpl: TemplateRef<ElementRef>;
    @ViewChild('profile') profileTpl: TemplateRef<ElementRef>;
    @ViewChild('tournaments') tournamentsTpl: TemplateRef<ElementRef>;
    @ViewChild('lastplayed') lastplayedTpl: TemplateRef<ElementRef>;

    @ViewChild('dragBtn') dragBtn: ElementRef;
    @ViewChild('backdrop') backdrop: ElementRef;
    @ViewChild('container') container: ElementRef;
    @ViewChild('activeTabLabel') activeTabLabel: ElementRef;

    @Input() public opened: boolean;
    @Input() public isMerchantWallet: boolean;

    public $params: Params.IGameDashboardCParams;
    public tabs: Params.IGameDashboardTab[];
    public activeTab: Params.IGameDashboardTab;
    public isMobile: boolean = false;
    public isAuth: boolean = false;
    public isKiosk: boolean;
    public hideBackdropLabel: boolean = false;
    public lastPlayedGames: Game[] = [];
    public lastPlayedGamesSlides: ISlide[] = [];
    public lastPlayedGamesShowLimit: number = 8;
    public lastPlayedGamesReady: boolean = false;
    public showMobileInstruction: boolean = false;
    public showPanchBtn: boolean = false;
    public decorAnimationState: string = 'hidden';
    public dontShowAgainBtn: ICheckboxCParams = {
        themeMod: 'bg-transparent',
        name: 'dont-show',
        text: gettext('Don\'t show again'),
        textSide: 'right',
        control: new FormControl(),
        onChange: (checked: boolean) => {
            this.cachingService.set<boolean>(this.dontShowInstructionKey, checked, true);
        },
    };
    public depositBtnParams = componentLib.wlcButton.deposit.params;
    public lastPlayedSwiper: ISliderCParams;
    public landscapeOrientation: boolean = false;
    public desktopSide: DashboardSide = 'right';
    public side: DashboardSide = 'left';
    public viewInited: boolean = false;

    public bonusesConfig: IWrapperCParams = {
        class: 'wlc-dashboard-bonuses-wrapper',
        components: [
            {
                name: 'bonuses.wlc-game-dashboard-bonuses',
            },
        ],
    };
    public tournamentsConfig: IWrapperCParams = {};
    public logOutConfig: IWrapperCParams = {components: []};
    public userNameConfig: IWrapperCParams = {components: []};
    public userStatsConfig: IWrapperCParams = {components: []};
    public userStatsWithoutDepositConfig: IWrapperCParams = {components: []};
    public loyaltyProgressConfig: IWrapperCParams = {components: []};
    public sliderConfig: IWrapperCParams = {components: []};

    protected breakpoints: IIndexing<number> = {
        backdropLabel: 680,
    };
    protected defaultWidth: number = 300;
    protected dashboardWidth: number = this.defaultWidth;
    protected translate: number = -this.dashboardWidth;
    protected oldDeltaX: number = 0;
    protected oldDirection: Direction;
    protected dontShowInstructionKey = 'gameDashboardDontShowInstruction';
    protected disableOpenOnClick: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IGameDashboardCParams,
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) protected window: Window,
        protected cdr: ChangeDetectorRef,
        protected actionService: ActionService,
        protected configService: ConfigService,
        protected renderer: Renderer2,
        protected cachingService: CachingService,
        protected eventService: EventService,
        protected gamesCatalogService: GamesCatalogService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.isKiosk = this.configService.get<AppType>('$base.app.type') === 'kiosk';

        this.tabs = this.isKiosk ? Params.dashboardTabsKiosk : Params.dashboardTabs;

        if (this.configService.get<boolean>('$base.tournaments.use')) {
            this.tournamentsConfig = {
                class: 'wlc-dashboard-tournaments-wrapper',
                components: [
                    {
                        name: 'tournaments.wlc-tournament-list',
                        params: this.$params.common.tournamentsListParams,
                    },
                ],
            };
        } else {
            this.tabs = _filter(this.tabs, (tab: Params.IGameDashboardTab) => tab.id !== 'tournaments');
        }

        this.backdropLabelVisibility();
        await this.loadLastPlayedGames();
        this.initLastPlayedSwiper();
        this.loadSliderComponentOnMobileLandscaped();

        if (this.$params.common?.desktopSide) {
            this.desktopSide = this.$params.common.desktopSide;
        }

        await this.configService.ready;
        this.isMobile = this.configService.get<boolean>('appConfig.mobile');

        this.isAuth = this.configService.get('$user.isAuthenticated');
        if (!this.isAuth) {
            this.addModifiers('not-auth');
        }

        this.loadProfileComponentsOnAuth();

        this.activeTab = _find(this.tabs, (tab) => {
            if (tab.auth) {
                return this.isAuth;
            }
            return true;
        });
        this.initEventHandlers();

        if (!this.landscapeOrientation) {
            this.showMobileInstruction = !this.configService.get('$games.gameDashboard.mobileUsageInstruction.disable')
                && !await this.cachingService.get<boolean>(this.dontShowInstructionKey)
                && !this.configService.get(`$games.${this.dontShowInstructionKey}`);
        }

        if (this.showMobileInstruction) {
            this.configService.set({
                name: `$games.${this.dontShowInstructionKey}`,
                value: true,
            });
            this.showPanchBtn = true;
            setTimeout(() => {
                this.decorAnimationState = 'shown';
                this.cdr.markForCheck();
            }, 500);
        } else {
            this.showPanchBtn = true;
        }
        this.cdr.markForCheck();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (changes.opened && this.$params) {
            if (changes.opened.currentValue) {
                this.open();
            } else {
                this.close();
            }
        }
    }

    public initLastPlayedSwiper(): void {
        let lastPlayedSlidesPerColumn: number = 2;
        if (this.document.documentElement.clientHeight > 450) {
            lastPlayedSlidesPerColumn = 3;
        }

        this.lastPlayedSwiper = {
            slidesAspectRatio: '1.2/1',
            slides: this.lastPlayedGamesSlides,
            swiper: {
                direction: 'horizontal',
                slidesPerView: 'auto',
                grid:{
                    rows: lastPlayedSlidesPerColumn,
                },
                pagination: {
                    clickable: true,
                },
                spaceBetween: 10,
                breakpoints: {
                    1000: {
                        direction: 'horizontal',
                        slidesPerView: 'auto',
                        grid: {
                            rows: lastPlayedSlidesPerColumn,
                        },
                        spaceBetween: 10,
                        pagination: {
                            clickable: true,
                        },
                    },
                    860: {
                        direction: 'horizontal',
                        slidesPerView: 'auto',
                        grid: {
                            rows: lastPlayedSlidesPerColumn,
                        },
                        spaceBetween: 10,
                        pagination: {
                            clickable: true,
                        },
                    },
                },
            },
        };
    }

    public ngAfterViewInit(): void {
        this.initDashboardPosition();
        this.close();
        this.setPanEvents(this.dragBtn);
        this.setPanEvents(this.backdrop, {
            disableDirection: Direction.Right,
        });
        this.viewInited = true;
    }

    /**
     * Open tab by id
     *
     * @param tab
     */
    public openTab(tab: Params.IGameDashboardTab): void {
        this.activeTab = tab;
        this.eventService.emit({
            name: Params.GameDashboardEvents.CHANED_TAB,
            data: {
                tab: tab,
            },
        });
        this.cdr.detectChanges();
    }

    /**
     * Check tab is active
     *
     * @param {IGameDashboardTab} tab
     * @returns {boolean}
     */
    public isActive(tab: Params.IGameDashboardTab): boolean {
        return tab.id === this.activeTab?.id;
    }

    /**
     * Check show tab or not
     *
     * @param {IGameDashboardTab} tab
     * @returns {boolean}
     */
    public checkShowTab(tab: Params.IGameDashboardTab): boolean {
        return !tab.auth || (tab.auth && this.isAuth);
    }

    /**
     * Open dashboard
     */
    public open(): void {
        this.changeView(true);
    }

    /**
     * Close dashboard
     */
    public close(): void {
        this.changeView(false);
    }

    public getTabContentTemplate(tab: Params.IGameDashboardTab): TemplateRef<any> {
        return _get(this, `${tab.id}Tpl`);
    }

    public onDashboardBtnClick(): void {
        if (this.disableOpenOnClick) {
            this.disableOpenOnClick = false;
            return;
        }

        this.addModifiers('animate');
        if (!this.opened) {
            if (this.showMobileInstruction) {
                this.showMobileInstruction = false;
            }
            this.open();
        } else {
            this.close();
        }
        this.cdr.markForCheck();
    }

    protected async loadLastPlayedGames(): Promise<void> {
        this.lastPlayedGames = await this.gamesCatalogService.getLastGames();
        this.lastPlayedGamesSlides = _map(this.lastPlayedGames, (game: Game) => {
            return {
                component: GameThumbComponent,
                componentParams: {
                    common: {
                        game: game,
                    },
                },
            };
        });
        this.lastPlayedGamesReady = true;
        this.cdr.detectChanges();
    }

    protected initDashboardPosition(): void {
        if (!this.container) {
            return;
        }

        if (this.isMobile) {
            this.side = 'left';
            this.renderer.setStyle(
                this.container.nativeElement,
                'left',
                '0',
            );
            this.renderer.setStyle(
                this.container.nativeElement,
                'right',
                'unset',
            );

            if (this.landscapeOrientation) {
                let widthCoef: number = 75;
                if (this.document.body.clientWidth < 600) {
                    widthCoef = 95;
                } else if (this.document.body.clientWidth < 680) {
                    widthCoef = 85;
                }
                this.dashboardWidth = this.document.body.clientWidth / 100 * widthCoef;
                this.translate = -this.dashboardWidth;
                this.renderer.setStyle(
                    this.container.nativeElement,
                    'width',
                    `${this.dashboardWidth}px`,
                );

                const labelMargin: number = (this.document.body.clientWidth - this.dashboardWidth) / 2;
                this.renderer.setStyle(
                    this.activeTabLabel.nativeElement,
                    'right',
                    `${labelMargin}px`,
                );
            } else {
                this.dashboardWidth = this.defaultWidth;
                this.translate = -this.dashboardWidth;
                this.renderer.setStyle(
                    this.container.nativeElement,
                    'width',
                    `${this.dashboardWidth}px`,
                );
            }

            if (this.showMobileInstruction) {
                this.close();
            }
        } else {
            this.side = this.desktopSide || this.side;
            this.dashboardWidth = this.defaultWidth;
            this.renderer.setStyle(
                this.container.nativeElement,
                'width',
                `${this.dashboardWidth}px`,
            );

            if (this.side == 'right' && this.container.nativeElement) {
                this.translate = this.dashboardWidth;
                this.renderer.setStyle(
                    this.container.nativeElement,
                    'left',
                    'unset',
                );
                this.renderer.setStyle(
                    this.container.nativeElement,
                    'right',
                    '0',
                );
            }
        }

        if (!this.opened) {
            this.close();
        }
    }

    /**
     * Handler for panstart event
     */
    protected panstartHandler(): void {
        if (!this.hasModifier('backdrop')) {
            this.addModifiers('backdrop');
        }
        this.removeModifiers('animate');
        this.oldDeltaX = 0;

        if (this.showMobileInstruction) {
            this.showMobileInstruction = false;
            this.cdr.markForCheck();
        }
        this.oldDirection = null;
    }

    /**
     * Handler for panend event
     */
    protected panendHandler(): void {
        const rightDirection = this.oldDirection == Direction.Right;
        this.addModifiers('animate');
        if (rightDirection) {
            this.open();
        } else {
            this.close();
        }
    }

    /**
     * Handler for panmove event
     *
     * @param {HammerInput} event
     * @param {IPanEventOptions} options
     */
    protected panmoveHandler(event: HammerInput, options?: IPanEventOptions): void {
        this.disableOpenOnClick = true;

        const leftDirection = this.checkDirection(Direction.Left, event);
        const rightDirection = this.checkDirection(Direction.Right, event);

        if (options?.disableDirection && (
            leftDirection && options.disableDirection === Direction.Left ||
            rightDirection && options.disableDirection === Direction.Right
        )) {
            return;
        }

        if (leftDirection || rightDirection) {
            let translate = 0;

            if (Math.abs(event.deltaY) > 50) {
                return;
            }

            if (leftDirection) {
                translate = Math.abs(event.deltaY) < 50
                    ? event.deltaX + 0
                    : -this.dashboardWidth;
                this.oldDeltaX = event.deltaX;
            } else {
                translate = Math.abs(event.deltaY) < 50
                    ? this.translate + event.deltaX - this.oldDeltaX
                    : this.translate;
                this.oldDeltaX = event.deltaX;
            }

            if ((leftDirection && translate > -this.dashboardWidth) ||
                (rightDirection && translate < 0)) {
                this.translate = translate;
                this.renderer.setStyle(
                    this.container.nativeElement,
                    'transform',
                    `translateX(${translate}px)`,
                );
            }
        }
    }

    /**
     * Check drag direcion
     *
     * @param {"left" | "right"} direction
     * @param {HammerInput} event
     * @returns {boolean}
     */
    protected checkDirection(direction: Direction, event: HammerInput): boolean {
        switch (direction) {
            case 'left':
                if (event.deltaX - this.oldDeltaX < 0) {
                    this.oldDirection = Direction.Left;
                }
                return event.deltaX - this.oldDeltaX < 0;
            case 'right':
                if (event.deltaX - this.oldDeltaX > 0) {
                    this.oldDirection = Direction.Right;
                }
                return event.deltaX - this.oldDeltaX > 0;
        }
    }

    /**
     * Init event handlers
     */
    protected initEventHandlers(): void {
        this.actionService.windowResize()
            .pipe(takeUntil(this.$destroy))
            .subscribe((event: IResizeEvent) => {

                const usedLandscapeMode: boolean = this.isMobile
                    && event.device.orientation === DeviceOrientation.Landscape;
                if (usedLandscapeMode !== this.landscapeOrientation) {
                    this.landscapeOrientation = usedLandscapeMode;
                    this.close();
                }

                this.backdropLabelVisibility();
                this.initLastPlayedSwiper();

                this.initDashboardPosition();

                if (this.landscapeOrientation) {
                    this.addModifiers('landscape');
                } else {
                    this.removeModifiers('landscape');
                }
                this.cdr.detectChanges();
            });

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                if (!type) {
                    return;
                }
                this.isMobile = type !== DeviceType.Desktop;

                if (this.isMobile) {
                    this.addModifiers('mobile');
                    this.removeModifiers('animate');
                    this.side = 'left';
                    if (this.actionService.device.orientation == DeviceOrientation.Landscape) {
                        this.addModifiers('landscape');
                        this.landscapeOrientation = true;
                    }
                    this.initLastPlayedSwiper();
                    if (this.showMobileInstruction) {
                        this.close();
                    }
                } else {
                    this.removeModifiers('mobile');
                    setTimeout(() => {
                        this.addModifiers('animate');
                    }, 1000);
                }
                this.initDashboardPosition();
                this.cdr.markForCheck();
            });

        this.eventService.subscribe({
            name: 'LOGOUT',
        }, () => {
            this.isAuth = false;
            this.addModifiers('not-auth');
            this.cdr.markForCheck();
        });

        this.eventService.subscribe({
            name: 'LOGIN',
        }, () => {
            this.isAuth = true;
            this.removeModifiers('not-auth');
            this.loadLastPlayedGames();
            this.initLastPlayedSwiper();
            this.cdr.markForCheck();
        });
    }

    protected backdropLabelVisibility(): void {
        this.hideBackdropLabel = this.actionService.device.windowWidth < this.breakpoints.backdropLabel;
    }

    /**
     * Change view (open or close)
     *
     * @param {boolean} open
     */
    protected changeView(open: boolean): void {
        this.opened = open;

        if (open) {
            this.addModifiers('backdrop');
        } else {
            this.removeModifiers('backdrop');
        }

        if (this.container) {
            const translateForClosed: number = this.side == 'right' ? this.dashboardWidth : -this.dashboardWidth;
            const translate: number = open ? 0 : translateForClosed;

            this.renderer.setStyle(
                this.container.nativeElement,
                'transform',
                `translateX(${translate}px)`,
            );
        }

        this.eventService.emit({
            name: open ? Params.GameDashboardEvents.OPENED : Params.GameDashboardEvents.CLOSED,
        });
        this.cdr.detectChanges();
    }

    /**
     * Set pan events
     *
     * @param {ElementRef} elem
     * @param {IPanEventOptions} options
     */
    protected setPanEvents(elem: ElementRef, options?: IPanEventOptions): void {
        const nativeElem = (elem.nativeElement as HTMLElement);
        const hammer$ = new HammerConfig(this.window).buildHammer(nativeElem) as HammerManager;

        fromEvent(hammer$, 'panstart').pipe(
            takeUntil(this.$destroy),
        ).subscribe(() => this.panstartHandler());

        fromEvent(hammer$, 'panmove').pipe(
            takeUntil(this.$destroy),
        ).subscribe((event: HammerInput) => this.panmoveHandler(event, options));

        fromEvent(hammer$, 'panend').pipe(
            takeUntil(this.$destroy),
        ).subscribe(() => this.panendHandler());
    }

    /**
     * Plugs slider in if mobile device is landscape orientated
     */
    protected loadSliderComponentOnMobileLandscaped(): void {
        const hasSlides = this.lastPlayedGamesReady && this.lastPlayedGamesSlides.length > 0;

        if (hasSlides && this.isMobile && this.landscapeOrientation) {
            this.loadSliderComponent();
        }
    }

    /**
     * Watches for user signing in.
     * When user is signed up, profile components will be lazy loaded.
     * It allows to load optional using components on demand
     */
    protected loadProfileComponentsOnAuth(): void {
        this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$')
            .pipe(
                first((profile) => !!profile),
                takeUntil(this.$destroy),
            )
            .subscribe(() => {
                this.loadProfileComponents();
            });
    }

    /**
     * Loads components from profile dashboard section
     */
    protected loadProfileComponents(): void {
        this.loyaltyProgressConfig = {
            components: [{name: 'user.wlc-loyalty-progress'}],
        };
        this.userStatsConfig = {
            components: [{name: 'user.wlc-user-stats'}],
        };
        this.userStatsWithoutDepositConfig = {
            components: [{
                name: 'user.wlc-user-stats',
                params: <IUserStatsCParams>{
                    useDepositBtn: false,
                },
            }],
        };

        this.userNameConfig = {
            components: [{name: 'user.wlc-user-name'}],
        };
        this.logOutConfig = {
            components: [{name: 'user.wlc-logout'}],
        };
    }

    /**
     * Loads slider component using for landscaped mobiles in "last played" section
     */
    protected loadSliderComponent(): void {
        this.sliderConfig = {
            components: [{
                name: 'promo.wlc-slider',
                params: <ISliderCParams>{
                    slides: this.lastPlayedGamesSlides,
                    ...this.lastPlayedSwiper,
                },
            }],
        };
    }
}
