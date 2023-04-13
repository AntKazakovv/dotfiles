import {
    Component,
    Inject,
    Input,
    ChangeDetectorRef,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
    ElementRef,
    AfterViewInit,
    HostBinding,
} from '@angular/core';
import {FormControl} from '@angular/forms';

import {
    distinctUntilChanged,
    filter,
    takeUntil,
} from 'rxjs/operators';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ITooltipCParams} from 'wlc-engine/modules/core/components/tooltip/tooltip.params';
import {
    NotificationEvents,
    IPushMessageParams,
} from 'wlc-engine/modules/core/system/services/notification';

import * as Params from './input.params';

import _kebabCase from 'lodash-es/kebabCase';
import _clone from 'lodash-es/clone';
import _union from 'lodash-es/union';
import _isString from 'lodash-es/isString';
import _flow from 'lodash-es/flow';

type TValueTransformer = (value: string) => string;

/**
 * Component input
 *
 * @example
 *
 * {
 *     name: 'core.wlc-input',
 * }
 *
 */
// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-input]',
    templateUrl: './input.component.html',
    styleUrls: ['./styles/input.component.scss'],
})
export class InputComponent extends AbstractComponent implements OnInit, OnChanges, AfterViewInit {
    @HostBinding('hidden') get hidden() {
        return !!this.$params?.isHidden?.();
    };

    @Input() protected inlineParams: Params.IInputCParams;
    @ViewChild('input') input: ElementRef;

    public $params: Params.IInputCParams;
    public control: FormControl;
    public fieldWlcElement: string;
    public useTooltip: boolean;
    public useAutoCompleteFix: boolean = true;

    protected readonly commonTransformers: TValueTransformer[] = [
        this.trimSpaces.bind(this),
        this.normalizeProhibitedPattern.bind(this),
        this.trimByMaxLength.bind(this),
    ];
    protected readonly numericTransformers: TValueTransformer[] = [
        this.normalizeLeadingZeroes.bind(this),
        this.normalizeNotNumericSymbols.bind(this),
        this.normalizeRadixOnceOnly.bind(this),
        this.normalizeSigns.bind(this),
        this.normalizeScale.bind(this),
        this.normalizeRadixAsFirst.bind(this),
    ];

    private _leadingZeroesRegEx: RegExp = /^0+(?=[^,\.])/;
    private _radixOnceOnlyRegEx: RegExp = /[,\.]/g;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IInputCParams,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.control = this.$params?.control;
        this.prepareModifiers();
        this.fieldWlcElement = 'input_' + _kebabCase(this.$params.name);
        this.useTooltip = !!(this.$params.common?.tooltipText || this.$params.common?.tooltipModal);

        this.setUseAutoCompleteFix();
    }

    public ngAfterViewInit(): void {
        if (this.shouldValueChangesBeTracked) {
            this.control.valueChanges
                .pipe(
                    filter((v: unknown) => _isString(v)),
                    distinctUntilChanged(),
                    takeUntil(this.$destroy),
                )
                .subscribe((v: string) => this.transformControlValue(v));
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.$params) {
            super.ngOnChanges(changes);
            this.$params = _clone(this.$params);
            this.setUseAutoCompleteFix();
            this.cdr.detectChanges();
            this.cdr.markForCheck();
        }
    }

    public get setInputModifiers(): string {
        if (!this.$params.common.customModifiers) {
            return;
        }

        return `${this.$params.class}__input--${this.$params.common.customModifiers}`;
    }

    public get inputLabel(): string {
        return this.$params.common.separateLabel || this.$params.common.placeholder;
    }

    /**
     * The method get wlc-tooltip inline parameters
     *
     * @method tooltipParams
     * @returns {ITooltipCParams} ITooltipCParams
     */
    public get tooltipParams(): ITooltipCParams {
        return {
            inlineText: this.$params.common?.tooltipText,
            themeMod: this.$params.common?.tooltipMod,
            iconName: this.$params.common?.tooltipIcon,
            modal: this.$params.common?.tooltipModal,
            modalParams: this.$params.common?.tooltipModalParams,
        };
    }

    protected get useNumeric(): boolean {
        return this.$params.numeric?.use;
    }

    protected get shouldValueChangesBeTracked(): boolean {
        return (
            this.control
            && !this.$params.disabled
            && !this.$params.common.readonly
            && !this.$params.clipboard
        );
    }

    public toggleType(type: string): void {
        this.$params.common.type = type;
    }

    public onClipboardCopied(): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'success',
                title: gettext('Info'),
                message: gettext('Copied to clipboard!'),
                wlcElement: 'notification_input-info',
            },
        });
    }

    /**
     * If params contains `prohibitedPattern` regular expression, prohibited symbols will be replaced
     */
    public onInput(): void {
        if (this.control.untouched) {
            this.control.markAsTouched();
        }
    }

    public onBlur(): void {
        this.syncValueWithModel();
        this.setInvalidOnEmptyRequired();

        if (!this.control.touched || !this.control.valid) {
            this.control.updateValueAndValidity();
            this.cdr.markForCheck();
        }
    }

    public isFieldRequired(): boolean {
        return this.$params.validators?.includes('required');
    }

    protected prepareModifiers(): void {
        if (!this.$params.common.customModifiers) {
            return;
        }

        let modifiers: Params.Modifiers[] = [];

        modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        this.addModifiers(modifiers);
    }

    protected setUseAutoCompleteFix(): void {
        this.useAutoCompleteFix = this.$params.common.fixAutoCompleteForm
            && this.$params.common.type === 'password';
    }

    protected syncValueWithModel(): void {
        if (!this.useNumeric) {
            this.control.patchValue(this.control.value, {
                emitEvent: false,
                emitModelToViewChange: true,
            });
        }
    }

    protected setInvalidOnEmptyRequired(): void {
        if (!this.control.value && this.isFieldRequired()) {
            this.control.setErrors({'empty-required-field': true});
        }
    }

    protected transformControlValue(value: string): void {
        const transformed = this.applyTransformers(value);

        if (transformed !== value) {
            this.control.setValue(transformed);
        }

        if (this.useNumeric) {
            this.fixVisibleRadix(transformed);
        }
    }

    protected fixVisibleRadix(value: string): void {
        if (value.includes(',')) {
            this.control.setValue(value.replace(',', '.'), {
                emitEvent: false,
                onlySelf: true,
                emitViewToModelChange: false,
                emitModelToViewChange: false,
            });
        }
    }

    protected applyTransformers(value: string): string {
        const transformed = this.applyCommonTransformers(value);

        if (this.useNumeric) {
            return this.applyNumericTransformers(transformed);
        }

        return transformed;
    }

    protected applyCommonTransformers(value: string): string {
        return _flow(this.commonTransformers)(value);
    }

    protected applyNumericTransformers(value: string): string {
        return _flow(this.numericTransformers)(value);
    }

    protected normalizeNotNumericSymbols(value: string): string {
        return value.replace(/[^\d,\.]/g, '');
    }

    protected normalizeScale(value: string): string {
        const scale = this.$params.numeric.scale;

        if (scale) {
            const radix = value.match(/[,\.]/g)?.[0];

            if (radix) {
                const [whole, fractional] = value.split(radix);

                if (fractional?.length > scale) {
                    return whole + radix + fractional.slice(0, scale);
                }
            }
        }

        return value;
    }

    protected normalizeSigns(value: string): string {
        if (this.$params.numeric.unsignedOnly) {
            return value.replace(/[\+-]/g, '');
        }

        return value;
    }

    protected normalizeRadixAsFirst(value: string): string {
        if (this.$params.numeric.prohibitRadixAsFirst) {
            return value.replace(/^[,\.]/, '');
        }

        return value;
    }

    protected normalizeRadixOnceOnly(value: string): string {
        const match = this._radixOnceOnlyRegEx.exec(value);
        const radix = match?.[0];

        if (!radix) {
            return value;
        }

        const radixAt = match.index;
        const clearedOfRadixRepeats = value.slice(radixAt).replace(this._radixOnceOnlyRegEx, '');

        return value.slice(0, radixAt) + radix + clearedOfRadixRepeats;
    }

    protected normalizeProhibitedPattern(value: string): string {
        if (this.$params.prohibitedPattern?.test(value)) {
            return value.replace(this.$params.prohibitedPattern, '');
        }

        return value;
    }

    protected normalizeLeadingZeroes(value: string): string {
        return value.replace(this._leadingZeroesRegEx, '');
    }

    protected trimSpaces(value: string): string {
        return value.trimStart().replace(/\s\s+/g, ' ');
    }

    protected trimByMaxLength(value: string): string {
        const maxLength = this.$params.common.maxLength;

        return maxLength ? value.slice(0, maxLength) : value;
    }
}
