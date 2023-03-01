import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import _reduce from 'lodash-es/reduce';
import _merge from 'lodash-es/merge';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    IFormWrapperCParams,
} from 'wlc-engine/modules/core';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

import * as Params from './amount-form.params';

@Component({
    selector: '[wlc-amount-form]',
    templateUrl: './amount-form.component.html',
    styleUrls: ['./styles/amount-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmountFormComponent extends AbstractComponent implements OnInit {

    public $params: Params.IAmountFormCParams;
    public formConfig: IFormWrapperCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAmountFormCParams,
        protected configService: ConfigService,
        protected eventService: EventService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.modifyFormConfig(this.$params.formConfig.components);
        this.formConfig = this.$params.formConfig;
    }

    /**
     * Handle form-wrapper submit event
     * @param {FormGroup} form `FormGroup`
     */
    public formSubmit(form: UntypedFormGroup): boolean {
        this.eventService.emit({
            name: this.$params.submitEventName,
            data: form.getRawValue(),
        });
        return true;
    }

    /**
     * Recursively check form to apply fast settings.
     * And will work if formConfig is changed.
     * @param {IFormComponent[]} componentsConfig `IFormComponent[]`
     */
    protected modifyFormConfig(componentsConfig: IFormComponent[]): void {
        _reduce(
            componentsConfig,
            (accumulator: IFormComponent[], component: IFormComponent): IFormComponent[] => {

                if (component.name === 'core.wlc-wrapper' && component.params?.components) {
                    this.modifyFormConfig(component.params.components);

                } else if (component.params?.name === 'amount') {
                    component.params = _merge(component.params, {
                        showCurrency: !this.$params.walletCurrency,
                        common: {
                            placeholder: this.$params.amountLabelText,
                            customModifiers: this.$params.walletCurrency && '',
                        },
                    });

                } else if (component.params?.name === 'submit') {
                    component.params = _merge(component.params, {
                        common: {
                            text: this.$params.submitButtonText,
                        },
                    });
                }

                accumulator.push(component);
                return accumulator;
            }, []);
    }

}
