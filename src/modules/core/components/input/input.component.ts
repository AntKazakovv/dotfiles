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
import {fromEvent} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';

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

        if (this.$params.common?.autocomplete === 'off') {
            this.$params.common.readonly = true;
        }

        this.setUseAutoCompleteFix();
    }

    public ngAfterViewInit(): void {
        if (this.$params.common?.autocomplete === 'off') {
            fromEvent(this.input.nativeElement, 'focus')
                .pipe(
                    takeUntil(this.$destroy),
                    take(1),
                )
                .subscribe(() => {
                    this.$params.common.readonly = false;
                    this.cdr.markForCheck();
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
    public onInput(event: Event): void {
        this.control.markAsTouched();
        if (!(this.$params.prohibitedPattern && this.control)) {
            return;
        }

        let value = this.control.value;
        if (this.$params.prohibitedPattern.test((event.target as HTMLInputElement).value)) {
            value = value.replace(this.$params.prohibitedPattern, '');
            this.control.patchValue(value, {emitEvent: false, emitModelToViewChange: true});
        }
    }

    public onBlur(event: Event): void {
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
