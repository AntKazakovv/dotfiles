import {
    IComponentParams,
    CustomType,
    IInputCParams,
    IFormWrapperCParams,
    ICheckboxCParams,
    IButtonParams,
} from 'wlc-engine/modules/core';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IDepositParams extends IComponentParams<Theme, Type, ThemeMod> {
    common?: {
        themeMod?: ThemeMod;
    };
}

export const defaultParams: IDepositParams = {

};

export const depositForm: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'core.wlc-input',
            params: <IInputCParams>{
                common: {
                    placeholder: gettext('Amount') + ' *',
                },
                exampleValue: gettext('Amount'),
                theme: 'vertical',
                locked: true,
                name: 'amount',
                validators: [
                    'required',
                    {
                        name: 'regExp',
                        options: new RegExp('^[0-9]+$'),
                    }],
            },
        },
        {
            name: 'core.wlc-checkbox',
            params: <ICheckboxCParams>{
                name: 'paymentRules',
                checkboxType: 'payment-rules',
                validators: ['required'],
            },
        },
        {
            name: 'core.wlc-button',
            params: <IButtonParams>{
                name: 'submit',
                common: {
                    text: 'Add deposit',
                },
            },
        },
    ],
};
