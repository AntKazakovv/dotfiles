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
    Subject,
    BehaviorSubject,
    asyncScheduler,
} from 'rxjs';
import {
    takeUntil,
    takeWhile,
    throttleTime,
    filter,
    map,
} from 'rxjs/operators';
import _forEach from 'lodash-es/forEach';
import _merge from 'lodash-es/merge';
import _get from 'lodash-es/get';

import {
    EventService,
    ConfigService,
    LogService,
    InjectionService,
} from 'wlc-engine/modules/core/system/services';
import {DeviceType} from 'wlc-engine/modules/core/system/models/device.model';
import {ActionService} from 'wlc-engine/modules/core/system/services/action/action.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {panelsEvents} from './../float-panels/float-panels.params';
import {
    GlobalHelper,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {WINDOW} from 'wlc-engine/modules/app/system';

import {
    BurgerPanelAppearanceAnimations,
} from './burger-panel.animations';
import {
    IFixedPanelConfig,
    IFixedPanelItemParams,
    TFixedPanelPos,
    TFixedPanelState,
    TFixedPanelStore,
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
    @HostBinding('@outerAppearance') public outerAppearance: Params.IFixedPanelAppearanceParams = {};

    @Input() public isOpened: boolean;
    @Input() protected id: string;
    @Input() protected inlineParams: Params.IBurgerPanelCParams;

    public updateScrollbar: Subject<void> = new Subject();
    public override $params: Params.IBurgerPanelCParams;
    public title: string;
    public headerMenuConfig: IWrapperCParams;

    protected hammer$: any; // HammerInstance
    protected panstart$: Observable<HammerInput>;
    protected panmove$: Observable<HammerInput>;
    protected panend$: Observable<HammerInput>;
    protected $width: number;
    protected animeType: string;
    protected collapsedByUser: boolean = false;
    protected isFixedPanel: boolean;
    protected fixedPanelConfig: IFixedPanelItemParams;
    protected fixedPanelPos: TFixedPanelPos;
    protected fixedPanelStore$: BehaviorSubject<TFixedPanelStore>;
    protected fixedPanelState: TFixedPanelState;

    constructor(
        @Optional() @Inject('injectParams') protected injectParams: Params.IBurgerPanelCParams,
        configService: ConfigService,
        protected eventService: EventService,
        protected renderer: Renderer2,
        protected logService: LogService,
        protected transitionService: TransitionService,
        cdr: ChangeDetectorRef,
        protected actionService: ActionService,
        @Inject(WINDOW) protected window: Window,
        @Inject(DOCUMENT) protected document: Document,
        private hostElement: ElementRef,
        private injectionService: InjectionService,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.init();
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        const {isOpened} = changes;
        this.onToggleHandler(isOpened);
    }

    public ngAfterViewInit(): void {

        if (this.$params.type === 'left-fixed' || this.$params.type === 'right-fixed') {
            this.isOpened = true;
        }
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        this.updateScrollbar.next();
        this.updateScrollbar.complete();

        if (this.isFixedPanel) {
            this.setFixedPanelCssVars();
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
        if (this.isFixedPanel && this.fixedPanelStore$) {
            animationState = this.getPanelState();
        } else {
            animationState = this.isOpened ? `${this.animeType}-open` : 'close';
        }
        return animationState;
    }

    public get isShowLogo(): boolean {
        return this.$params.showLogo && this.fixedPanelStore$?.getValue().left !== 'compact';
    }

    public get useBackdrop(): boolean {
        return this.fixedPanelConfig?.useBackdrop
            && this.fixedPanelState === 'expanded'
            && this.window.innerWidth < this.fixedPanelConfig?.breakpoints.expand;
    }

    /** Changes fixed panel state
     *
     * @param {boolean} saveState - save fixed panel's current state to localstorage
     */

    public toggleFixedPanel(saveState: boolean = false): void {
        const state: TFixedPanelState = this.fixedPanelState === 'expanded' ? 'compact' : 'expanded';

        this.updatePanelStore(state);

        if (saveState) {
            this.configService.saveFixedPanelState(this.fixedPanelPos, this.fixedPanelState);
        }
    }

    protected updateAnimations(): void {
        this.outerAppearance = {
            value: this.fixedPanelState,
            params: this.fixedPanelConfig.sizes,
        };
    }

    protected getPanelState(store?: TFixedPanelStore): TFixedPanelState {
        const panelStore: TFixedPanelStore = store || this.fixedPanelStore$.getValue();
        return _get(panelStore, this.fixedPanelPos);
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
        this.fixedPanelPos = <TFixedPanelPos>this.$params.type.replace('-fixed', '');
        this.fixedPanelConfig = this.configService.get<IFixedPanelConfig>('$base.fixedPanel')
            .panels[this.fixedPanelPos];

        if (this.fixedPanelConfig) {
            this.fixedPanelStore$ = this.configService.get<BehaviorSubject<TFixedPanelStore>>('fixedPanelStore$');
            this.fixedPanelState = this.prepareFixedPanelState(this.fixedPanelConfig, this.fixedPanelPos);

            this.setFixedPanelCssVars();
            this.updatePanelStore(this.fixedPanelState);
            this.addModifiers(`view-${this.fixedPanelState}`);
            this.initFixedPanelListeners();
        }
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

        this.fixedPanelStore$
            .pipe(
                filter(store => store[this.fixedPanelPos] !== this.fixedPanelState),
                map(store => store[this.fixedPanelPos]),
                takeUntil(this.$destroy),
            )
            .subscribe((state: TFixedPanelState): void => {
                this.removeModifiers(`view-${this.fixedPanelState}`);

                this.fixedPanelState = state;

                this.updateAnimations();
                this.addModifiers(`view-${state}`);
            });

        if (this.$params.useScroll) {
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
    }

    protected prepareFixedPanelState(config: IFixedPanelItemParams, position: TFixedPanelPos): TFixedPanelState {
        const userStore: TFixedPanelStore = this.configService.get<TFixedPanelStore>({
            name: 'fixedPanelUserState',
            storageType: 'localStorage',
        });
        const userState: TFixedPanelState = _get(userStore, position);
        let panelState: TFixedPanelState = userState;

        if (!userState) {
            if (config.compactModByDefault || this.window.innerWidth < config.breakpoints.expand) {
                panelState = 'compact';
            } else {
                panelState = 'expanded';
            }
        }

        return panelState;
    }

    protected autoSwitchFixedPanel(canExpanded: boolean): void {
        const userStore: TFixedPanelStore = this.configService.get<TFixedPanelStore>({
            name: 'fixedPanelUserState',
            storageType: 'localStorage',
        });
        const userState = _get(userStore, this.fixedPanelPos);
        const currentState: TFixedPanelState = this.fixedPanelState;

        if (!userState && (currentState === 'compact' && canExpanded || currentState === 'expanded' && !canExpanded)) {
            this.toggleFixedPanel();
        } else {
            this.updatePanelStore(currentState);
        }
    }

    protected setFixedPanelCssVars(): void {
        const root: HTMLElement = this.document.documentElement;
        const isVisiblePanel: boolean = this.window.innerWidth >= this.fixedPanelConfig.breakpoints.display;
        if (root) {
            _forEach(this.fixedPanelConfig.sizes, (val, key) => {
                const value = isVisiblePanel ? `${val}px` : null;
                root.style.setProperty(`--fp-${this.fixedPanelPos}-size-${key}`, value);
            });

            _forEach(this.fixedPanelConfig.breakpoints, (val, key) => {
                const value = isVisiblePanel ? `${val}px` : null;
                root.style.setProperty(`--fp-${this.fixedPanelPos}-bp-${key}`, value);
            });
        }
    }

    protected updatePanelStore(state: TFixedPanelState): void {
        const newState = {[this.fixedPanelPos]: state};
        this.fixedPanelStore$.next(_merge(this.fixedPanelStore$.getValue(), newState));
    }
}
