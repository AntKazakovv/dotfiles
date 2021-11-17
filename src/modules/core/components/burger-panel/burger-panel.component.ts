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
import {TransitionService} from '@uirouter/core';
import {
    Observable,
    fromEvent,
} from 'rxjs';
import {
    takeUntil,
    takeWhile,
} from 'rxjs/operators';

import {
    EventService,
    ConfigService,
    LogService,
    InjectionService,
} from 'wlc-engine/modules/core/system/services';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {HammerConfig} from 'wlc-engine/modules/core/system/config/hammer.config';
import {panelsEvents} from './../float-panels/float-panels.params';
import {IWrapperCParams} from 'wlc-engine/modules/core';

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
})
export class BurgerPanelComponent extends AbstractComponent
    implements OnInit, OnDestroy, OnChanges, AfterViewInit {

    @HostBinding('attr.aria-hidden') get isHidden(): boolean {
        return !this.isOpened;
    };

    @Input() public isOpened: boolean;
    @Input() protected id: string;
    @Input() protected inlineParams: Params.IBurgerPanelCParams;

    public $params: Params.IBurgerPanelCParams;
    public title: string;
    public headerMenuConfig: IWrapperCParams;

    protected isUseTouchEvents: boolean;
    protected hammer$: any; // HammerInstance
    protected panstart$: Observable<HammerInput>;
    protected panmove$: Observable<HammerInput>;
    protected panend$: Observable<HammerInput>;
    protected $width: number;

    constructor(
        @Optional() @Inject('injectParams') protected injectParams: Params.IBurgerPanelCParams,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected renderer: Renderer2,
        protected logService: LogService,
        protected transitionService: TransitionService,
        protected cdr: ChangeDetectorRef,
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

            this.hammer$ = new HammerConfig().buildHammer(element);
            this.panstart$ = fromEvent(this.hammer$, 'panstart');
            this.panmove$ = fromEvent(this.hammer$, 'panmove');
            this.panend$ = fromEvent(this.hammer$, 'panend');

            this.initPanListeners();
        }
    }

    public closePanel(): void {
        this.eventService.emit({
            name: panelsEvents.PANEL_CLOSE,
            from: this.id,
            data: this.id,
        });
    }

    protected async init(): Promise<void> {
        this.addModifiers(this.id);
        await this.configService.ready;
        await this.injectionService.importModules(['menu']);
        this.initHeaderMenu();

        this.title = this.$params.title || gettext('Menu');

        if (this.$params.touchEvents?.use) {
            this.isUseTouchEvents = this.$params.touchEvents?.onlyMobile ?
                this.configService.get<boolean>('appConfig.mobile') : true;
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
            takeUntil(this.$destroy),
            takeWhile(() => this.isOpened),
        ).subscribe(() => this.panstartHandler());

        this.panmove$.pipe(
            takeUntil(this.$destroy),
            takeWhile(() => this.isOpened),
        ).subscribe((event: HammerInput) => this.panmoveHandler(event));

        this.panend$.pipe(
            takeUntil(this.$destroy),
            takeWhile(() => this.isOpened),
        ).subscribe((event: HammerInput) => this.panendHandler(event));
    }

    protected onToggleHandler(isOpened: SimpleChange): void {
        if (!isOpened.isFirstChange()) {
            if (isOpened.currentValue) {
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
                    params: {
                        common: {
                            panelType: this.$params.type,
                        },
                    },
                },
            ],
        };
    }
}
