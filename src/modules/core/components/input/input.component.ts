import {
    Component,
    Inject,
    Input,
    ChangeDetectorRef,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import {FormControl} from '@angular/forms';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
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
export class InputComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input() protected inlineParams: Params.IInputCParams;
    public $params: Params.IInputCParams;
    public control: FormControl;
    public fieldWlcElement: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IInputCParams,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.control = this.$params?.control;
        this.prepareModifiers();
        this.fieldWlcElement = 'input_' + _kebabCase(this.$params.name);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.$params) {
            super.ngOnChanges(changes);
            this.$params = _clone(this.$params);
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
                wlcElement: 'notifiсation_input-info',
            },
        });
    }

    /**
     * If params contains `prohibitedPattern` regular expression, prohibited symbols will be replaced
     */
    public onInput(event: InputEvent): void {
        if (!(this.$params.prohibitedPattern && this.control)) {
            return;
        }

        let value = this.control.value;
        if (this.$params.prohibitedPattern.test(event.data)) {
            value = value.replace(this.$params.prohibitedPattern, '');
            this.control.patchValue(value, {emitEvent: false, emitModelToViewChange: true});
        }
    }

    protected prepareModifiers(): void {
        if (!this.$params.common.customModifiers) {
            return;
        }

        let modifiers: Params.Modifiers[] = [];

        modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        this.addModifiers(modifiers);
    }

    protected isFieldRequired(): boolean {
        return this.$params.validators?.includes('required');
    }
}
