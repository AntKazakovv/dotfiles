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

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {HammerConfig} from 'wlc-engine/modules/core/system/config/hammer.config';
import {
    ActionService,
    ConfigService,
    DeviceType,
    DeviceOrientation,
    EventService,
    IIndexing,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {CachingService} from 'wlc-engine/modules/core/system/services/caching/caching.service';
import * as Params from './game-dashboard.params';
import {DashboardSide} from 'wlc-engine/modules/games/components/game-dashboard/game-dashboard.params';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {ISlide, ISliderCParams} from 'wlc-engine/modules/promo/components/slider/slider.params';
import {GameThumbComponent} from 'wlc-engine/modules/games/components/game-thumb/game-thumb.component';
import {IResizeEvent} from 'wlc-engine/modules/core/system/services/action/action.service';
import * as componentLib from 'wlc-engine/modules/core/system/config/layouts/components';

import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {
    takeUntil,
} from 'rxjs/operators';

import {
    assign as _assign,
    get as _get,
    find as _find,
    filter as _filter,
} from 'lodash-es';

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

    public $params: Params.IGameDashboardCParams;
    public tabs: Params.IGameDashboardTab[] = Params.dashboardTabs;
    public activeTab: Params.IGameDashboardTab;
    public isMobile: boolean = false;
    public isAuth: boolean = false;
    public hideBackdropLabel: boolean = false;
    public lastPlayedGames: Game[] = [];
    public lastPlayedGamesSlides: ISlide[] = [];
    public lastPlayedGamesShowLimit: number = 8;
    public lastPlayedGamesReady: boolean = false;
    public showMobileInstruction: boolean = false;
    public showPanchBtn: boolean = false;
    public decorAnimationState: string = 'hidden';
    public dontShowAgainBtn = {
        themeMod: 'bg-transparent',
        name: 'dont-show',
        text: gettext('Don\'t show again'),
        textSide: 'right',
        control: new FormControl(),
        onChange: (checked: boolean) => {
            this.cachingService.set<boolean>(this.dontShowInstructionKey, checked, true);
        },
    };
    public bonusesConfig: IWrapperCParams = {
        class: 'wlc-dashboard-bonuses-wrapper',
        components: [
            {
                name: 'bonuses.wlc-game-dashboard-bonuses',
            },
        ],
    };
    public tournamentsConfig: IWrapperCParams = {};
    public depositBtnParams = componentLib.wlcButton.deposit.params;
    public lastPlayedSwiper: ISliderCParams;
    public landscapeOrientation: boolean = false;
    public desktopSide: DashboardSide = 'right';
    public side: DashboardSide = 'left';
    public viewInited: boolean = false;

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
        @Inject(DOCUMENT) protected document: HTMLDocument,
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
        this.loadLastPlayedGames();
        this.initLastPlayedSwiper();

        if (this.$params.common?.desktopSide) {
            this.desktopSide = this.$params.common.desktopSide;
        }

        await this.configService.ready;
        this.isMobile = this.configService.get<boolean>('appConfig.mobile');
        this.isAuth = this.configService.get('$user.isAuthenticated');
        if (!this.isAuth) {
            this.addModifiers('not-auth');
        }

        this.activeTab = _find(this.tabs, (tab) => {
            if (tab.auth) {
                return this.isAuth;
            }
            return true;
        });
        this.initEventHandlers();

        this.showMobileInstruction = !await this.cachingService.get<boolean>(this.dontShowInstructionKey) &&
            !this.configService.get(`$games.${this.dontShowInstructionKey}`);

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
        if (changes.opened) {
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
                slidesPerColumn: lastPlayedSlidesPerColumn,
                pagination: {
                    clickable: true,
                },
                spaceBetween: 10,
                breakpoints: {
                    1000: {
                        direction: 'horizontal',
                        slidesPerView: 'auto',
                        slidesPerColumn: lastPlayedSlidesPerColumn,
                        spaceBetween: 10,
                        pagination: {
                            clickable: true,
                        },
                    },
                    860: {
                        direction: 'horizontal',
                        slidesPerView: 'auto',
                        slidesPerColumn: lastPlayedSlidesPerColumn,
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
            name : Params.Events.CHANED_TAB,
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

    protected async loadLastPlayedGames(): Promise<void> {
        this.lastPlayedGames = await this.gamesCatalogService.getLastGames();
        this.lastPlayedGamesSlides = this.lastPlayedGames.map((game: Game) => {
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
     *
     * @param {HammerInput} event
     * @param {IPanEventOptions} options
     */
    protected panstartHandler(event: HammerInput, options?: IPanEventOptions): void {
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
     *
     * @param {HammerInput} event
     * @param {IPanEventOptions} options
     */
    protected panendHandler(event: HammerInput, options?: IPanEventOptions): void {
        const leftDirection = this.oldDirection == Direction.Left;
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

        if (options?.disableDirection) {
            if (leftDirection && options.disableDirection === Direction.Left ||
                rightDirection && options.disableDirection === Direction.Right
            ) {
                return;
            }
        }

        if (leftDirection || rightDirection) {
            let translate = 0;

            if (Math.abs(event.deltaY) > 50) {
                return;
            }

            if (leftDirection) {
                translate = Math.abs(event.deltaY) < 50 ? event.deltaX + 0 : -this.dashboardWidth;
                this.oldDeltaX = event.deltaX;
            } else {
                translate = Math.abs(event.deltaY) < 50 ? this.translate + event.deltaX - this.oldDeltaX : this.translate;
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
                const currentOrientation = !event.device.isDesktop && event.device.orientation == DeviceOrientation.Landscape;
                if (currentOrientation !== this.landscapeOrientation) {
                    this.landscapeOrientation = currentOrientation;
                    this.close();
                    return;
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
        if (!this.container) {
            return;
        }
        this.cdr.detectChanges();
        this.opened = open;

        if (open) {
            this.addModifiers('backdrop');
        } else {
            this.removeModifiers('backdrop');
        }

        const translateForClosed: number = this.side == 'right' ? this.dashboardWidth : -this.dashboardWidth;
        const translate: number = open ? 0 : translateForClosed;
        this.renderer.setStyle(
            this.container.nativeElement,
            'transform',
            `translateX(${translate}px)`,
        );
        this.eventService.emit({
            name: open ? Params.Events.OPENED : Params.Events.CLOSED,
        });
    }

    /**
     * Set pan events
     *
     * @param {ElementRef} elem
     * @param {IPanEventOptions} options
     */
    protected setPanEvents(elem: ElementRef, options?: IPanEventOptions): void {
        const nativeElem = (elem.nativeElement as HTMLElement);
        const hammer$ = new HammerConfig().buildHammer(nativeElem) as HammerManager;

        fromEvent(hammer$, 'panstart').pipe(
            takeUntil(this.$destroy),
        ).subscribe((event: HammerInput) => this.panstartHandler(event, options));

        fromEvent(hammer$, 'panmove').pipe(
            takeUntil(this.$destroy),
        ).subscribe((event: HammerInput) => this.panmoveHandler(event, options));

        fromEvent(hammer$, 'panend').pipe(
            takeUntil(this.$destroy),
        ).subscribe((event: HammerInput) => this.panendHandler(event, options));
    }

    protected onDashboardBtnClick(): void {
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
}
