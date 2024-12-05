import {
    Component,
    OnInit,
    Inject,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core';
import {
    UntypedFormControl,
} from '@angular/forms';

import {AbstractComponent} from 'wlc-engine/modules/core';
import {IButtonCParams} from 'wlc-engine/modules/core/components/button/button.interfaces';

import * as Params from './radio-buttons.params';

import _compact from 'lodash-es/compact';
import _isNil from 'lodash-es/isUndefined';
import _concat from 'lodash-es/concat';

@Component({
    selector: '[wlc-radio-buttons]',
    templateUrl: './radio-buttons.component.html',
    styleUrls: ['./styles/radio-buttons.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RadioButtonsComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IRadioButtonsCParams;

    public override $params: Params.IRadioButtonsCParams;
    public control: UntypedFormControl;
    protected itemInputControls: Map<unknown, UntypedFormControl> = new Map();

    constructor(
        @Inject('injectParams') protected injectParams: Params.IRadioButtonsCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.control = Array.isArray(this.$params.name)
            // @ts-ignore no-implicit-any #672571
            ? this.$params[this.$params.name[0]].control
            : this.$params.control;

        this.prepareItems();

        if (this.$params.theme === 'button') {
            this.prepareButtonMods();
        }

        if (!this.control.value && !_isNil(this.$params.defaultValue)) {
            this.control.setValue(this.$params.items[this.$params.defaultValue]?.value);
        }
    }

    public isActive(item: Params.IRadioButtonOption): boolean {
        return item.value === this.control.value;
    }

    public changeHandler(item: Params.IRadioButtonOption): void {

        if (item.input) {
            this.itemInputControls.get(item.value).enable();
        }

        if (this.itemInputControls.size) {
            this.itemInputControls.forEach((ctrl, key) => {
                if (key !== item.value) {
                    ctrl.disable;
                }
            });
        }

        this.control.setValue(item.value);
        this.cdr.markForCheck();
    }

    protected prepareItems(): void {
        for (const item of this.$params.items) {
            if (item.input) {
                // @ts-ignore no-implicit-any #672571
                const control: UntypedFormControl = item.input.control = this.$params[item.input.name].control;
                this.itemInputControls.set(item.value, control);
                if (!this.isActive(item)) {
                    control.disable();
                }
            }
        }
    }

    protected prepareButtonMods(): void {
        const buttonParams = this.configService.get<IButtonCParams>({name: '$modules.core.components.wlc-button'});

        if (buttonParams) {
            const args = _compact(_concat<string>(
                [],
                buttonParams?.theme ? 'theme-button-' + buttonParams.theme : '',
                buttonParams?.type ? 'type-button-' + buttonParams.type : '',
                buttonParams?.themeMod ? 'themeMod-button-' + buttonParams.themeMod : '',
            ));

            this.addModifiers(args);
        }
    }
}
