import {
    AfterContentInit,
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
    SimpleChanges,
    OnInit,
    HostBinding,
} from '@angular/core';
import {StateService} from '@uirouter/core';
import {Subject, fromEvent} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {IconComponent} from '../icon/icon.component';
import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core/system/services';
import * as BParams from './button.params';

import {
    forEach as _forEach,
    union as _union,
    keys as _keys,
    isUndefined as _isUndefined,
    get as _get,
} from 'lodash';

export {IButtonParams} from './button.params';

@Component({
    selector: 'button[wlc-button]',
    templateUrl: './button.component.html',
    styleUrls: ['./styles/button.component.scss'],
    preserveWhitespaces: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent extends AbstractComponent implements OnInit,
    OnChanges,
    OnDestroy,
    AfterContentInit,
    AfterViewInit {

    @ContentChild(IconComponent, {read: ElementRef}) IconComponentElement!: ElementRef;
    @Input() public text: string;
    @Input() protected type: BParams.Type;
    @Input() protected theme: BParams.Theme;
    @Input() protected themeMod: BParams.ThemeMod;
    @Input() protected customMod: BParams.CustomMod
    @Input() protected size: BParams.Size;
    @Input() protected icon: string;
    @Input() protected index: BParams.Index;

    public $params: BParams.IButtonParams;
    protected $loading = new Subject<boolean>();
    @HostBinding('attr.type') typeAttr = this.params.common?.typeAttr;

    constructor(
        @Inject('injectParams') protected params: BParams.IButtonParams,
        protected elementRef: ElementRef,
        protected cdr: ChangeDetectorRef,
        protected ConfigService: ConfigService,
        protected stateService: StateService,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<BParams.IButtonParams>>{
                injectParams: params,
                defaultParams: BParams.defaultParams,
            }, ConfigService);
    }

    ngOnInit(): void {
        super.ngOnInit(this.prepareParams());
        this.prepareModifiers();
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    ngAfterContentInit(): void {
    }

    public ngAfterViewInit(): void {
        //todo refactor
        if (this.$params.common?.event || this.params.common?.sref) {
            fromEvent(this.elementRef.nativeElement, 'click')
                .pipe(takeUntil(this.$destroy))
                .subscribe(() => {
                    if (this.$params.common?.event) {
                        this.eventService.emit(this.$params.common.event);
                    } else if (this.params.common?.sref) {
                        this.stateService.go(this.params.common.sref);
                    }
                });
        }
    }

    protected prepareParams(): BParams.IButtonParams {
        const inputProperties: string[] = ['text', 'size', 'icon', 'index', 'event', 'type'];
        const inlineParams: BParams.IButtonParams = {
            common: {},
        };

        _forEach(inputProperties, key => {
            if (!_isUndefined(_get(this, key))) {
                inlineParams.common[key] = _get(this, key);
            }
        });

        return _keys(inlineParams.common).length ? inlineParams : null;
    }

    protected prepareModifiers(): void {
        let modifiers: BParams.Modifiers[] = [];
        if (this.$params.common.size) {
            modifiers.push(`size-${this.$params.common.size}`);
        }
        if (this.$params.common.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }
}
