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
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {
    distinctUntilChanged,
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
@Component({
    selector: '[wlc-input]',
    templateUrl: './input.component.html',
    styleUrls: ['./styles/input.component.scss'],
})
export class InputComponent extends AbstractComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() protected inlineParams: Params.IInputCParams;
    @ViewChild('input') input: ElementRef;

    public $params: Params.IInputCParams;
    public control: FormControl;
    public fieldWlcElement: string;
    public useTooltip: boolean;
    public useAutoCompleteFix: boolean = true;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IInputCParams,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
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
        if (this.control
            && !this.$params.disabled
            && !this.$params.common.readonly
            && !this.$params.clipboard) {
            this.control.valueChanges
                .pipe(takeUntil(this.$destroy), distinctUntilChanged())
                .subscribe((value: unknown): void => {
                    if (_isString(value)) {
                        let clearValue: string = value.trimStart().replace(/\s\s+/g, ' ');

                        if (this.$params.prohibitedPattern && this.$params.prohibitedPattern.test(value)) {
                            clearValue = value.replace(this.$params.prohibitedPattern, '');
                        }

                        if (clearValue !== value) {
                            this.control.setValue(clearValue);
                        }
                    }
                });
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

    public toggleType(type: string): void {
        this.$params.common.type = type;
    }

    public onClipboardCopied(): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'info',
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
        this.control.patchValue(this.control.value, {emitEvent: false, emitModelToViewChange: true});

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
}
