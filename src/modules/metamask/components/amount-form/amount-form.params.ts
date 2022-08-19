import {
    IComponentParams,
    CustomType,
    IFormWrapperCParams,
} from 'wlc-engine/modules/core';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IAmountFormCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /** If `true` - show metamask block */
    showMetamaskBlock?: boolean;
    /** If defined - `customModifiers` of amount field is empty instead default `right-shift`,
     * and `showCurrency` is `false` */
    walletCurrency?: string;
    /** Replace only label text in amount field without rewriting form config */
    amountLabelText?: string;
    /** Replace only submit button text without rewriting form config */
    submitButtonText?: string;
    /** By default 'AMOUNT_CONFIRMED' */
    submitEventName?: string;
    /** Default form config, which is modified by params `walletCurrency`, `amountLabelText`, `submitButtonText` */
    formConfig?: IFormWrapperCParams;
};

export const defaultParams: IAmountFormCParams = {
    class: 'wlc-amount-form',
    componentName: 'wlc-amount-form',
    moduleName: 'metamask',
    submitEventName: 'AMOUNT_CONFIRMED',
    formConfig: {
        components: [
            {
                name: FormElements.amount.name,
                params: {
                    ...FormElements.amount.params,
                    exampleValue: gettext('Enter amount'),
                    validators: [
                        'required',
                        {
                            name: 'min',
                            options: '0.000001', // ethers fail to count less values
                            text: gettext('The entered amount is less than the minimum'),
                        },
                        {
                            name: 'pattern',
                            options: /^\d+(\.\d+)*$/,
                            text: gettext('The value is incorrect'),
                        },
                    ],
                },
            },
            {
                name: 'core.wlc-button',
                params: {
                    name: 'submit',
                    customMod: ['submit'],
                    common: {
                        text: gettext('Continue'),
                    },
                },
            },
        ],
    },
};
