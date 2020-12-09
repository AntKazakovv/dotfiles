import {
    Component,
    Inject,
    OnInit,
    Input,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import * as Params from 'wlc-engine/modules/core/components/input/input.params';
import {ConfigService} from 'wlc-engine/modules/core';

import {
    union as _union,
} from 'lodash';

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
    }

    public get setInputModifiers(): string {
        return `${this.$params.class}__input--${this.$params.common.customModifiers}`;
    }

    public toggleType(type: string): void {
        this.$params.common.type = type;
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];

        if (this.$params.common.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }

        this.addModifiers(modifiers);
    }
}
