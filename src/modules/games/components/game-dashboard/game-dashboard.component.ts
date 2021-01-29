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
} from '@angular/core';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {HammerConfig} from 'wlc-engine/modules/core/system/config/hammer.config';
import {ActionService, ConfigService, DeviceType, EventService} from 'wlc-engine/modules/core';
import {CachingService} from 'wlc-engine/modules/core/system/services/caching/caching.service';
import * as Params from './game-dashboard.params';

import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {
    takeUntil,
} from 'rxjs/operators';

import {
    assign as _assign,
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
                transform: 'translateX(-100%)',
            })),
            state('shown', style({
                transform: 'translateX(0)',
            })),
            transition('hidden => shown', [
                animate('0.5s'),
            ]),
        ]),
        trigger('rightShift', [
            state('hidden', style({
                transform: 'translateX(100%)',
            })),
            state('shown', style({
                transform: 'translateX(0)',
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
        trigger('panchBtnColor', [
            state('inactive', style({
            })),
            state('active', style({
                background: '#fff',
            })),
            transition('inactive => active', [
            ]),
        ]),
    ],
})
export class GameDashboardComponent extends AbstractComponent implements OnInit, OnChanges, AfterViewInit {
    @ViewChild('dragBtn') dragBtn: ElementRef;
    @ViewChild('backdrop') backdrop: ElementRef;
    @ViewChild('container') container: ElementRef;

    @Input() public opened: boolean;

    public $params: Params.IGameDashboardCParams;
    public tabs: Params.IGameDashboardTab[] = Params.dashboardTabs;
    public activeTabId: string = '';
    public isMobile: boolean = false;
    public isAuth: boolean = false;
    public showMobileInstruction: boolean = false;
    public showPanchBtn: boolean = false;
    public decorAnimationState: string = 'hidden';

    protected dashboardWidth: number = 300;
    protected translate: number;
    protected oldDeltaX: number = 0;
    protected oldDirection: Direction;
    protected instructionCacheKey = 'gameDashboardInstruction';

    constructor(
        @Inject('injectParams') protected injectParams: Params.IGameDashboardCParams,
        protected cdr: ChangeDetectorRef,
        protected actionService: ActionService,
        protected configService: ConfigService,
        protected renderer: Renderer2,
        protected cachingService: CachingService,
        protected eventService: EventService,
        private hostElem: ElementRef,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.activeTabId = this.tabs[0].id;
        this.isMobile = this.configService.get<boolean>('appConfig.mobile');
        this.isAuth = this.configService.get('$user.isAuthenticated');
        this.initEventHandlers();

        this.cachingService.get<boolean>(this.instructionCacheKey).then((data: boolean) => {
            this.showMobileInstruction = !data;
            if (this.showMobileInstruction) {
                this.showPanchBtn = true;
                setTimeout(() => {
                    this.decorAnimationState = 'shown';
                    this.cdr.markForCheck();
                }, 500);
            } else {
                this.showPanchBtn = true;
            }
            this.cdr.markForCheck();
        });
        this.cdr.markForCheck();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (changes.opened) {
            changes.opened.currentValue ? this.open() : this.close();
        }
    }

    public ngAfterViewInit(): void {
        this.close();
        this.setPanEvents(this.dragBtn);
        this.setPanEvents(this.backdrop, {
            disableDirection: Direction.Left,
        });

        setTimeout(() => {
            this.addModifiers('animate');
        }, 1000);
    }

    /**
     * Open tab by id
     *
     * @param {string} id
     */
    public openTab(id: string): void {
        this.activeTabId = id;
        this.cdr.detectChanges();
    }

    /**
     * Check tab is active
     *
     * @param {IGameDashboardTab} tab
     * @returns {boolean}
     */
    public isActive(tab: Params.IGameDashboardTab): boolean {
        return tab.id === this.activeTabId;
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
            this.cachingService.set<boolean>(this.instructionCacheKey, true);
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
        if (leftDirection) {
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
                translate = Math.abs(event.deltaY) < 50 ? event.deltaX + this.dashboardWidth : this.dashboardWidth;
                this.oldDeltaX = event.deltaX;
            } else {
                translate = Math.abs(event.deltaY) < 50 ? this.translate + event.deltaX - this.oldDeltaX : this.translate;
                this.oldDeltaX = event.deltaX;
            }

            if ((leftDirection && translate > 0 && translate < this.dashboardWidth) ||
                (rightDirection && translate <= this.dashboardWidth)) {
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
        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                if (!type) {
                    return;
                }

                this.isMobile = type !== DeviceType.Desktop;
                this.isMobile ? this.addModifiers('mobile') : this.removeModifiers('mobile');
                if (this.isMobile && this.showMobileInstruction) {
                    this.close();
                }
                this.cdr.markForCheck();
            });

        this.eventService.subscribe({
            name: 'LOGOUT',
        }, () => {
            this.isAuth = false;
            this.cdr.markForCheck();
        });

        this.eventService.subscribe({
            name: 'LOGIN',
        }, () => {
            this.isAuth = true;
            this.cdr.markForCheck();
        });
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
        this.opened = open;

        open ? this.addModifiers('backdrop') : this.removeModifiers('backdrop');

        const translate: number = open ? 0 : this.dashboardWidth;
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
}
