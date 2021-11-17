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
} from '@angular/core';
import {
    RawParams,
    StateService,
} from '@uirouter/core';

import {
    Subject,
    fromEvent,
} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    EventService,
    IconComponent,
} from 'wlc-engine/modules/core';

import * as Params from './button.params';

import _get from 'lodash-es/get';
import _forEach from 'lodash-es/forEach';
import _union from 'lodash-es/union';
import _keys from 'lodash-es/keys';
import _isUndefined from 'lodash-es/isUndefined';
import _merge from 'lodash-es/merge';
import _isArray from 'lodash-es/isArray';

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
    @Input() public sref: string;
    @Input() public srefParams: RawParams;

    @Input() protected type: Params.Type;
    @Input() protected typeAttr: string;
    @Input() protected theme: Params.Theme;
    @Input() protected themeMod: Params.ThemeMod;
    @Input() protected customMod: Params.CustomMod;
    @Input() protected size: Params.Size;
    @Input() protected icon: string;
    @Input() protected iconPath: string;
    @Input() protected index: Params.Index;
    @Input() protected wlcElement: string;
    @Input() protected inlineParams: Params.IButtonCParams;

    public $params: Params.IButtonCParams;
    protected $loading = new Subject<boolean>();
    @HostBinding('attr.type') get typeAttrValue() {return this.params?.common?.typeAttr || this.typeAttr;}

    constructor(
        @Inject('injectParams')
        protected params: Params.IButtonCParams,
        protected elementRef: ElementRef,
        protected cdr: ChangeDetectorRef,
        protected ConfigService: ConfigService,
        protected stateService: StateService,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<Params.IButtonCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, ConfigService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.prepareParams());
        this.prepareModifiers();
    }

    public ngOnChanges(changes) {
        if (_get(changes, 'text') && _get(this, '$params.common.text')) {
            this.$params.common.text = this.text;
        }
    }

    public ngAfterViewInit(): void {
        if (this.$params.common?.event || this.$params.common?.sref) {
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
                    }
                });
        }
    }

    protected prepareParams(): Params.IButtonCParams {
        if (this.inlineParams) {
            return this.inlineParams;
        }

        const inputProperties: string[] = [
            'text',
            'size',
            'icon',
            'iconPath',
            'index',
            'event',
            'type',
            'theme',
            'sref',
            'srefParams',
            'typeAttr',
        ];
        const inlineParams: Params.IButtonCParams = {
            common: {},
        };

        _forEach(inputProperties, key => {
            if (!_isUndefined(_get(this, key))) {
                inlineParams.common[key] = _get(this, key);
            }
        });

        inlineParams.wlcElement = this.wlcElement;
        _merge(inlineParams, this.inlineParams);

        return _keys(inlineParams.common).length ? inlineParams : null;
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params?.common?.size) {
            modifiers.push(`size-${this.$params.common.size}`);
        }
        if (this.$params?.common?.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }
}

