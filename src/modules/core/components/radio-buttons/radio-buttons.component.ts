import {
    Component,
    OnInit,
    Inject,
    Input,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {IButtonCParams} from 'wlc-engine/modules/core/components/button/button.params';

import * as Params from './radio-buttons.params';

import _compact from 'lodash-es/compact';
import _isUndefined from 'lodash-es/isUndefined';
import _concat from 'lodash-es/concat';

@Component({
    selector: '[wlc-radio-buttons]',
    templateUrl: './radio-buttons.component.html',
    styleUrls: ['./styles/radio-buttons.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RadioButtonsComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IRadioButtonsCParams;

    public $params: Params.IRadioButtonsCParams;
    public control: UntypedFormControl;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IRadioButtonsCParams,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.control = this.$params.control;

        if (this.$params.theme === 'button') {
            this.prepareButtonMods();
        }

        if (!this.control.value && !_isUndefined(this.$params.defaultValue)) {
            this.control.setValue(this.$params.items[this.$params.defaultValue].value);
        }
    }

    public changeHandler(item: Params.IRadioButtonOption): void {
        this.control.setValue(item.value);
        this.cdr.markForCheck();
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
