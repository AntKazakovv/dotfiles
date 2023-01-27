import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    OnChanges,
    SimpleChanges,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    HostBinding,
    SimpleChange,
    ElementRef,
    Renderer2,
    AfterViewInit,
    Inject,
    Optional,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {TransitionService} from '@uirouter/core';
import {
    Observable,
    fromEvent,
    Subject,
    BehaviorSubject,
    asyncScheduler,
} from 'rxjs';
import {
    distinctUntilChanged,
    startWith,
    takeUntil,
    takeWhile,
    throttleTime,
} from 'rxjs/operators';
import _forEach from 'lodash-es/forEach';

import {
    EventService,
    ConfigService,
    LogService,
    InjectionService,
} from 'wlc-engine/modules/core/system/services';
import {DeviceType} from 'wlc-engine/modules/core/system/models/device.model';
import {ActionService} from 'wlc-engine/modules/core/system/services/action/action.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {HammerConfig} from 'wlc-engine/modules/core/system/config/hammer.config';
import {panelsEvents} from './../float-panels/float-panels.params';
import {
    GlobalHelper,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {WINDOW} from 'wlc-engine/modules/app/system';

import {BurgerPanelAppearanceAnimations} from './burger-panel.animations';
import {
    IFixedPanelConfig,
    TFixedPanelState,
} from 'wlc-engine/modules/core/system/interfaces/base-config/fixed-panel.interface';
import * as Params from './burger-panel.params';

enum Directions {
    left = 2,
    right = 4,
}

@Component({
    selector: '[wlc-burger-panel]',
    templateUrl: './burger-panel.component.html',
    styleUrls: ['./styles/burger-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        ...BurgerPanelAppearanceAnimations,
    ],
})
export class BurgerPanelComponent extends AbstractComponent
    implements OnInit, OnDestroy, OnChanges, AfterViewInit {

    @HostBinding('attr.aria-hidden') get isHidden(): boolean {
        return !this.isOpened;
    };

    @Input() public isOpened: boolean;
    @Input() protected id: string;
    @Input() protected inlineParams: Params.IBurgerPanelCParams;

    public updateScrollbar: Subject<void> = new Subject();
    public $params: Params.IBurgerPanelCParams;
    public title: string;
    public headerMenuConfig: IWrapperCParams;
    public fixedPanelConfig: IFixedPanelConfig;
    public fixedPanelState$: BehaviorSubject<TFixedPanelState>;

    protected isUseTouchEvents: boolean;
    protected hammer$: any; // HammerInstance
    protected panstart$: Observable<HammerInput>;
    protected panmove$: Observable<HammerInput>;
    protected panend$: Observable<HammerInput>;
    protected $width: number;
    protected animeType: string;
    protected collapsedByUser: boolean = false;
    protected isFixedPanel: boolean;

    constructor(
        @Optional() @Inject('injectParams') protected injectParams: Params.IBurgerPanelCParams,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected renderer: Renderer2,
        protected logService: LogService,
        protected transitionService: TransitionService,
        protected cdr: ChangeDetectorRef,
        protected actionService: ActionService,
        @Inject(WINDOW) protected window: Window,
        @Inject(DOCUMENT) protected document: Document,
        private hostElement: ElementRef,
        private injectionService: InjectionService,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.init();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const {isOpened} = changes;
        this.onToggleHandler(isOpened);
    }

    public ngAfterViewInit(): void {
        if (this.isUseTouchEvents) {
            const element = (this.hostElement.nativeElement as HTMLElement);
            this.$width = element.clientWidth;

            this.hammer$ = new HammerConfig(this.window).buildHammer(element);
            this.panstart$ = fromEvent(this.hammer$, 'panstart');
            this.panmove$ = fromEvent(this.hammer$, 'panmove');
            this.panend$ = fromEvent(this.hammer$, 'panend');

            this.initPanListeners();
        }

        if (this.$params.type === 'left-fixed') {
            this.isOpened = true;
        }
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.updateScrollbar.next();
        this.updateScrollbar.complete();

        if (this.isFixedPanel) {
            this.updateFixedPanelCssVars();
        }
    }

    public closePanel(): void {
        this.eventService.emit({
            name: panelsEvents.PANEL_CLOSE,
            from: this.id,
            data: this.id,
        });
    }

    public get animationState(): TFixedPanelState | 'close' | string {
        let animationState: string;
        if (this.isFixedPanel) {
            animationState = this.fixedPanelState$.getValue();
        } else {
            animationState = this.isOpened ? `${this.animeType}-open` : 'close';
        }
        return animationState;
    }

    public get useBackdrop(): boolean {
        return this.fixedPanelState$?.getValue() === 'expanded'
            && this.window.innerWidth < this.fixedPanelConfig.breakpoints.expand;
    }

    /** Changes fixed panel state
     *
     * @param {boolean} saveState - save fixed panel's current state to localstorage
     */

    public toggleFixedPanel(saveState: boolean = false): void {
        const currentState: TFixedPanelState = this.fixedPanelState$.getValue();
        const state: TFixedPanelState = currentState === 'expanded' ? 'compact' : 'expanded';

        if (saveState) {
            this.configService.set<TFixedPanelState>({
                name: 'fixedPanelUserState',
                value: state,
                storageType: 'localStorage',
            });
        }

        this.fixedPanelState$.next(state);
    }

    protected async init(): Promise<void> {
        this.addModifiers(this.id);
        await this.configService.ready;

        const isFixed = this.$params.type === 'left-fixed' || this.$params.type === 'right-fixed';
        const useFixedPanel = this.configService.get<boolean>('$base.fixedPanel.use');

        this.isFixedPanel = useFixedPanel && isFixed;

        if (this.isFixedPanel) {
            this.prepareFixedPanel();
        }

        await this.injectionService.importModules(['menu']);
        this.initHeaderMenu();

        this.title = this.$params.title || gettext('Menu');

        if (this.$params.touchEvents?.use) {
            this.isUseTouchEvents = this.$params.touchEvents?.onlyMobile ?
                this.configService.get<boolean>('appConfig.mobile') : true;
        }

        this.animeType = this.$params.animeType;
        if (this.animeType === 'translate-stagger' && this.$params.theme === 'default') {
            this.animeType += '-default';
        }

        this.eventService.subscribe({name: 'TRANSITION_ENTER'}, () => {
            this.closePanel();
        }, this.$destroy);

        this.eventService.filter(
            [{name: 'LOGIN'}, {name: 'LOGOUT'}],
            this.$destroy)
            .subscribe({
                next: () => {
                    setTimeout(() => {
                        this.closePanel();
                    }, 0);
                    this.cdr.detectChanges();
                },
            });
    }

    protected panstartHandler(): void {
        this.renderer.setStyle(
            this.hostElement.nativeElement,
            'transition',
            'none',
        );
    }

    protected panmoveHandler(event: HammerInput): void {
        const direction = this.whatDirection(this.$params.type, event.deltaX);
        const translate = direction && Math.abs(event.deltaY) < 50 ? event.deltaX : 0;

        this.renderer.setStyle(
            this.hostElement.nativeElement,
            'transform',
            `translateX(${translate}px)`,
        );
    }

    protected panendHandler(event: HammerInput): void {
        const {nativeElement} = this.hostElement;

        this.renderer.removeStyle(nativeElement, 'transition');
        this.renderer.removeStyle(nativeElement, 'transform');

        if (event.direction === Directions[this.$params.type] &&
            (Math.abs(event.deltaX) > this.$width / 5 * 3 ||
                (event.deltaTime < this.$width && Math.abs(event.deltaX) > 70))) {
            this.closePanel();
        }
    }

    protected initPanListeners(): void {
        this.panstart$.pipe(
            takeWhile(() => this.isOpened),
            takeUntil(this.$destroy),
        ).subscribe(() => this.panstartHandler());

        this.panmove$.pipe(
            takeWhile(() => this.isOpened),
            takeUntil(this.$destroy),
        ).subscribe((event: HammerInput) => this.panmoveHandler(event));

        this.panend$.pipe(
            takeWhile(() => this.isOpened),
            takeUntil(this.$destroy),
        ).subscribe((event: HammerInput) => this.panendHandler(event));
    }

    protected onToggleHandler(isOpened: SimpleChange): void {
        if (!isOpened.isFirstChange()) {
            if (isOpened.currentValue) {
                if (this.actionService.getDeviceType() === DeviceType.Desktop) {
                    this.updateScrollbar.next();
                }
                this.addModifiers('open');
            } else {
                this.removeModifiers('open');
            }
        }
    }

    protected whatDirection(type: Params.BurgerPanelType = 'left', delta: number): boolean {
        switch (type) {
            case 'left':
                return delta <= 0;
            case 'right':
                return delta >= 0;
            default:
                const error = `No such type of panel - ${type}`;
                this.logService.sendLog({code: '0.4.1', data: error});
                return;
        }
    }

    protected initHeaderMenu(): void {
        this.headerMenuConfig = {
            components: [
                {
                    name: 'menu.wlc-burger-panel-header-menu',
                    display: {
                        before: 1023,
                    },
                    params: {
                        common: {
                            panelType: this.$params.type,
                        },
                    },
                },
            ],
        };
    }

    protected prepareFixedPanel(): void {
        this.fixedPanelConfig = this.configService.get<IFixedPanelConfig>('$base.fixedPanel');
        this.fixedPanelState$ = this.configService.get<BehaviorSubject<TFixedPanelState>>('fixedPanelState$');

        this.initFixedPanelListeners();
        this.fixedPanelState$.next(this.fixedPanelState$.getValue());
    }

    protected initFixedPanelListeners(): void {
        const updateScrollbarThrottleTime: number = 400;
        const expandBp: MediaQueryList =
            this.window.matchMedia(`(min-width: ${this.fixedPanelConfig.breakpoints.expand}px)`);

        GlobalHelper.mediaQueryObserver(expandBp)
            .pipe(takeUntil(this.$destroy))
            .subscribe((event: MediaQueryListEvent) => {
                this.autoSwitchFixedPanel(event.matches);
            });

        this.fixedPanelState$
            .pipe(
                startWith(null),
                distinctUntilChanged((prev: TFixedPanelState, curr: TFixedPanelState): boolean => {
                    if (prev !== curr) {
                        this.removeModifiers(`view-${prev}`);
                        this.addModifiers(`view-${curr}`);
                    }
                    return prev === curr;
                }),
                takeUntil(this.$destroy),
            )
            .subscribe((): void => {
                this.updateFixedPanelCssVars();
            });

        GlobalHelper.createMutationObserver(
            this.hostElement.nativeElement,
            {
                childList: true,
                subtree: true,
            })
            .pipe(
                throttleTime(updateScrollbarThrottleTime, asyncScheduler, {trailing: true}),
                takeUntil(this.$destroy),
            )
            .subscribe(() => {
                this.updateScrollbar.next();
            });
    }

    protected autoSwitchFixedPanel(canExpanded: boolean): void {
        const userState: TFixedPanelState = this.configService.get<TFixedPanelState>({
            name: 'fixedPanelUserState',
            storageType: 'localStorage',
        });
        const currentState: TFixedPanelState = this.fixedPanelState$.getValue();

        if (!userState && (currentState === 'compact' && canExpanded || currentState === 'expanded' && !canExpanded)) {
            this.toggleFixedPanel();
        } else {
            this.fixedPanelState$.next(currentState);
        }
    }

    protected updateFixedPanelCssVars(): void {
        const root: HTMLElement = this.document.documentElement;
        const isVisiblePanel: boolean = this.document.body.clientWidth >= this.fixedPanelConfig.breakpoints.display;

        if (root) {
            _forEach(this.fixedPanelConfig.sizes, (val, key) => {
                const value = isVisiblePanel ? `${val}px` : null;
                root.style.setProperty(`--fp-size-${key}`, value);
            });

            _forEach(this.fixedPanelConfig.breakpoints, (val, key) => {
                const value = isVisiblePanel ? `${val}px` : null;
                root.style.setProperty(`--fp-breakpoint-${key}`, value);
            });
        }
    }
}
