import {
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {FormControl} from '@angular/forms';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';

import * as Params from './input.params';

import {
    union as _union,
    kebabCase as _kebabCase,
} from 'lodash-es';

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
export class InputComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IInputCParams;
    public $params: Params.IInputCParams;
    public control: FormControl;
    public fieldWlcElement: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IInputCParams,
        protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.control = this.$params?.control;
        this.prepareModifiers();
        this.fieldWlcElement = 'input_' + _kebabCase(this.$params.name);
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

    public onClipboardCopied(value: string): void {
        // TODO notification
    }

    protected prepareModifiers(): void {
        if (!this.$params.common.customModifiers) {
            return;
        }

        let modifiers: Params.Modifiers[] = [];

        modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        this.addModifiers(modifiers);
    }
}
