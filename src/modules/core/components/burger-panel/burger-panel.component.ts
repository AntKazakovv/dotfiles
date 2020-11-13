import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    OnChanges,
    SimpleChanges,
    ChangeDetectionStrategy,
    HostBinding,
    SimpleChange,
    ElementRef,
    Renderer2,
    AfterViewInit,
} from '@angular/core';
import {Observable} from 'rxjs';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {
    takeUntil,
    takeWhile,
} from 'rxjs/operators';

import {
    EventService,
    ConfigService,
    LogService,
} from 'wlc-engine/modules/core/services';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {HammerConfig} from 'wlc-engine/config/hammer.config';
import * as Params from './burger-panel.params';
import {panelsEvents} from './../float-panels/float-panels.params';

enum Directions {
    left = 2,
    right = 4,
};

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

    protected isUseTouchEvents: boolean;
    protected hammer$: any; // HammerInstance
    protected panstart$: Observable<HammerInput>;
    protected panmove$: Observable<HammerInput>;
    protected panend$: Observable<HammerInput>;

    protected $width: number;

    constructor (
        protected configService: ConfigService,
        protected eventService: EventService,
        protected renderer: Renderer2,
        protected logService: LogService,
        private hostElement: ElementRef,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.addModifiers(this.id);

        this.title = this.$params.title || 'Menu';

        if (this.$params.touchEvents?.use) {
            this.isUseTouchEvents = this.$params.touchEvents?.onlyMobile ?
                this.configService.get<boolean>('appConfig.mobile') : true;
        }
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
        }
    }

    public closePanel(): void {
        this.eventService.emit({
            name: panelsEvents.PANEL_CLOSE,
            from: this.id,
            data: this.id,
        });
    }

    protected panstartHandler(event: HammerInput): void {
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

    protected initListeners(): void {
        this.panstart$.pipe(
            takeUntil(this.$destroy),
            takeWhile(() => this.isOpened),
        ).subscribe((event: HammerInput) => this.panstartHandler(event));

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
                if (this.isUseTouchEvents) {
                    this.initListeners();
                }
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
}
