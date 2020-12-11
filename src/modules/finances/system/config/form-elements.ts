import {
    IComponentParams,
    CustomType,
    IInputCParams,
    IFormWrapperCParams,
    ICheckboxCParams,
    IButtonParams,
} from 'wlc-engine/modules/core';

export namespace FormElements {
    export const amount = {
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
    };

    export const rules = {
        name: 'core.wlc-checkbox',
        params: <ICheckboxCParams>{
            name: 'paymentRules',
            checkboxType: 'payment-rules',
            validators: ['required'],
        },
    };

    export const depositButton ={
        name: 'core.wlc-button',
        params: <IButtonParams>{
            name: 'submit',
            common: {
                text: gettext('Add deposit'),
            },
        },
    };

    export const withdrawButton ={
        name: 'core.wlc-button',
        params: <IButtonParams>{
            name: 'submit',
            common: {
                text: gettext('Withdrawal'),
            },
        },
    };
}