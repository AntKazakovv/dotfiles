import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    HostBinding,
    SimpleChanges,
    inject,
} from '@angular/core';
import {
    RawParams,
    StateService,
} from '@uirouter/core';

import {
    Subject,
    fromEvent,
} from 'rxjs';
import {
    first,
    takeUntil,
} from 'rxjs/operators';
import _get from 'lodash-es/get';
import _forEach from 'lodash-es/forEach';
import _union from 'lodash-es/union';
import _keys from 'lodash-es/keys';
import _isUndefined from 'lodash-es/isUndefined';
import _merge from 'lodash-es/merge';
import _isArray from 'lodash-es/isArray';
import _has from 'lodash-es/has';
import _set from 'lodash-es/set';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {IconComponent} from 'wlc-engine/modules/core/components/icon/icon.component';
import {AnimateButtonsService} from 'wlc-engine/modules/core/system/services/animate-buttons/animate-buttons.service';
import {TAnimateButtonHandlerOnService} from 'wlc-engine/modules/core/system/interfaces/animate-buttons.interface';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './button.params';

export {IButtonCParams} from './button.params';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'button[wlc-button]',
    templateUrl: './button.component.html',
    styleUrls: ['./styles/button.component.scss'],
    preserveWhitespaces: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent extends AbstractComponent implements OnInit,
    OnDestroy,
    OnChanges,
    AfterViewInit {

    @ContentChild(IconComponent, {read: ElementRef}) IconComponentElement!: ElementRef;
    @Input() public text: string;
    @Input() public event: {name: string, data?: unknown};
    @Input() public href: string;
    @Input() public sref: string;
    @Input() public srefParams: RawParams;
    // This prop is used by 'loading' themeMod
    @Input() public loadingValue?: number;

    @Input() protected type: Params.Type;
    @Input() protected typeAttr: string;
    @Input() protected theme: Params.Theme;
    @Input() protected themeMod: Params.ThemeMod;
    @Input() protected customMod: Params.CustomMod;
    @Input() protected size: Params.Size;
    @Input() protected icon: string;
    @Input() protected iconPath: string;
    @Input() protected counter: Params.CounterType;
    @Input() protected index: Params.Index;
    @Input() protected wlcElement: string;
    @Input() protected animation: Params.TButtonAnimation;
    @Input() protected inlineParams: Params.IButtonCParams;

    public ready: boolean = false;
    public override $params: Params.IButtonCParams;
    protected $loading = new Subject<boolean>();
    protected animateButtonsService: AnimateButtonsService;

    @HostBinding('attr.type') get typeAttrValue(): string {
        return this.params?.common?.typeAttr || this.typeAttr;
    }

    constructor(
        @Inject('injectParams') protected params: Params.IButtonCParams,
        @Inject(WINDOW) protected window: Window,
        protected elementRef: ElementRef,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected stateService: StateService,
        protected eventService: EventService,
        protected injectionService: InjectionService,
    ) {
        super(
            <IMixedParams<Params.IButtonCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.prepareParams());
        this.prepareModifiers();
        if (this.$params.common.animation) {
            this.animationHandlers();
        }
        this.ready = true;

        if (this.$params.pending$) {
            this.$params.pending$
                .pipe(takeUntil(this.$destroy))
                .subscribe((pending: boolean): void => {
                    if (pending) {
                        this.addModifiers('pending');
                    } else {
                        this.removeModifiers('pending');
                    }
                });
        }
    }

    public override ngOnChanges(changes: SimpleChanges): void {

        if (!this.ready) {
            return;
        }

        super.ngOnChanges(changes);

        if (_get(changes, 'text') && _get(this, '$params.common.text')) {
            this.$params.common.text = this.text;
        }

        if (_get(changes, 'inlineParams')) {
            super.ngOnInit(this.prepareParams());
        }

        if (_get(changes, 'iconPath')) {
            this.$params.common.iconPath = this.iconPath;
        }

        if (_has(changes, 'themeMod') && _has(this, '$params')) {
            this.$params.themeMod = this.themeMod;
            this.prepareHostClass();
        }
        this.cdr.detectChanges();
    }

    public ngAfterViewInit(): void {
        if (this.$params.common?.event || this.$params.common?.sref || this.$params.common?.href) {
            fromEvent(this.elementRef.nativeElement, 'click')
                .pipe(takeUntil(this.$destroy))
                .subscribe(() => {
                    if (this.$params?.common?.event) {
                        if (!_isArray(this.$params.common.event)) {
                            this.eventService.emit(this.$params.common.event);
                        } else {
                            _forEach(this.$params.common.event, (event) => {
                                this.eventService.emit(event);
                            });
                        }
                    } else if (this.$params.common?.sref) {
                        this.stateService.go(this.$params.common.sref, this.$params.common.srefParams);
                    } else if (this.$params.common?.href) {
                        this.window.open(this.$params.common?.href, this.$params.common?.hrefTarget || '_blank');
                    }
                });
        }
    }

    protected prepareParams(): Params.IButtonCParams {
        if (this.inlineParams) {
            return this.inlineParams;
        }

        const inputProperties: (keyof Params.IButtonCParams['common'])[] = [
            'text',
            'size',
            'icon',
            'iconPath',
            'index',
            'event',
            'sref',
            'srefParams',
            'typeAttr',
            'animation',
            'selectorScroll',
            'counter',
        ];
        const inlineParams: Params.IButtonCParams = {
            common: {},
        };

        _forEach(inputProperties, key => {
            if (!_isUndefined(_get(this, key))) {
                _set(inlineParams.common, key, _get(this, key));
            }
        });

        inlineParams.wlcElement = this.wlcElement;
        _merge(inlineParams, this.inlineParams);

        return _keys(inlineParams.common).length ? inlineParams : null;
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params.common.size) {
            modifiers.push(`size-${this.$params.common.size}`);
        }
        if (this.$params.common.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        if (this.$params.common.animation) {
            modifiers.push(`animate-${this.$params.common.animation.type}`);
        }
        this.addModifiers(modifiers);
    }

    protected animationHandlers(): void {
        switch (this.$params.common.animation.handlerType) {
            case 'deposit':
                this.animateButtonsService = inject(AnimateButtonsService);

                this.removeModifiers(`animate-${this.$params.common.animation.type}`);

                if (this.animateButtonsService.isFirstButtonAnimateEvent.deposit) {
                    this.eventService.emit({
                        name: 'ANIMATE_BUTTON',
                        data: <TAnimateButtonHandlerOnService>'deposit',
                    });
                }

                this.animationsSubscribe();
                break;

            case 'click':
                this.subscribeStopAnimationOnClick();
                break;
        }
    }

    protected subscribeStopAnimationOnClick(): void {
        fromEvent(this.elementRef.nativeElement, 'click')
            .pipe(
                first(),
                takeUntil(this.$destroy),
            )
            .subscribe((): void  => {
                this.removeModifiers(`animate-${this.$params.common.animation.type}`);
            });
    }

    protected animationsSubscribe(): void {
        this.eventService.subscribe({name: 'START_ANIMATE_BUTTON'}, (data: TAnimateButtonHandlerOnService) => {
            if (this.$params.common.animation.handlerType === 'deposit' && data === 'deposit') {
                this.addModifiers(`animate-${this.$params.common.animation.type}`);

                this.eventService.subscribe({name: 'STOP_ANIMATE_BUTTON'}, () => {
                    this.removeModifiers(`animate-${this.$params.common.animation.type}`);
                }, this.$destroy);
            }
        }, this.$destroy);
    }
}
