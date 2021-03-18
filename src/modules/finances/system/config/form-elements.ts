import {
    IComponentParams,
    CustomType,
    IInputCParams,
    IFormWrapperCParams,
    ICheckboxCParams,
    IButtonCParams,
    ISelectCParams,
} from 'wlc-engine/modules/core';

export namespace FormElements {
    export const amount = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            common: {
                placeholder: gettext('Amount'),
                customModifiers: 'right-shift',
                type: 'number',
            },
            exampleValue: gettext('Amount'),
            theme: 'vertical',
            locked: true,
            name: 'amount',
            currency: true,
            prohibitedPattern: /[^0-9.,]/,
            customMod: ['amount'],
            validators: [
                'required',
                'numberDecimal',
                {
                    name: 'min',
                    text: 'The entered amount is less than the minimum',
                    options: 10,
                },
                {
                    name: 'max',
                    text: 'The entered amount is more than the maximum',
                    options: 10000,
                },
            ],
        },
    };

    export const rules = {
        name: 'core.wlc-checkbox',
        params: <ICheckboxCParams>{
            name: 'paymentRules',
            checkboxType: 'payment-rules',
            validators: ['required'],
            customMod: ['rules'],
        },
    };

    export const depositButton = {
        name: 'core.wlc-button',
        params: <IButtonCParams>{
            name: 'submit',
            wlcElement: 'button_deposit',
            common: {
                text: gettext('Deposit'),
            },
            customMod: ['submit', 'deposit'],
        },
    };

    export const withdrawButton ={
        name: 'core.wlc-button',
        params: <IButtonCParams>{
            name: 'submit',
            wlcElement: 'button_withdraw',
            common: {
                text: gettext('Withdraw'),
            },
            customMod: ['submit', 'withdraw'],
        },
    };

    export const email = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('Email'),
            },
            locked: true,
            name: 'email',
            validators: ['required', 'email'],
            exampleValue: 'dasha.kot@egamings.com',
        },
    };

    export const firstName = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('First name'),
            },
            prohibitedPattern: /[0-9_!,.¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]"№^]/,
            name: 'firstName',
            validators: ['required',
                {
                    name: 'minLength',
                    options: 2,
                },
                {
                    name: 'maxLength',
                    options: 25,
                },
                {
                    name: 'pattern',
                    options: /[^0-9_!,.¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]"№^]/,
                },
            ],
        },
    };

    export const lastName = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('Last name'),
            },
            prohibitedPattern: /[0-9_!,.¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]"№^]/,
            name: 'lastName',
            validators: ['required',
                {
                    name: 'minLength',
                    options: 2,
                },
                {
                    name: 'maxLength',
                    options: 25,
                },
                {
                    name: 'pattern',
                    options: /[^0-9_!,.¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]"№^]/,
                },
            ],
        },
    };

    export const gender = {
        name: 'core.wlc-select',
        params: <ISelectCParams>{
            theme: 'vertical',
            labelText: gettext('Gender'),
            common: {
                placeholder: gettext('Gender'),
            },
            locked: true,
            name: 'gender',
            validators: ['required'],
            options: 'genders',
        },
    };

    export const country = {
        name: 'core.wlc-select',
        params: <ISelectCParams>{
            theme: 'vertical',
            labelText: gettext('Country'),
            common: {
                placeholder: gettext('Country'),
            },
            locked: true,
            name: 'countryCode',
            validators: ['required'],
            options: 'countries',
        },
    };

    export const city = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('City'),
            },
            name: 'city',
            validators: ['required'],
        },
    };

    export const address = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('Address'),
            },
            name: 'address',
            validators: ['required'],
        },
    };

    export const postalCode =  {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('Postal code'),
            },
            name: 'postalCode',
            validators: ['required'],
        },
    };

    export const pep = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('PEP'),
            },
            name: 'pep',
            validators: ['required'],
        },
    };

    export const ibanNumber = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('Iban number'),
            },
            name: 'ibanNumber',
            validators: ['required'],
        },
    };

    export const password = {
        name: 'core.wlc-input',
        params: <IInputCParams> {
            theme: 'vertical',
            common: {
                placeholder: gettext('Current password'),
                type: 'password',
                customModifiers: 'right-shift',
                usePasswordVisibilityBtn: true,
            },
            customMod: ['password'],
            name: 'currentPassword',
            validators: ['required', 'password',
                {
                    name: 'minLength',
                    options: 6,
                },
                {
                    name: 'maxLength',
                    options: 50,
                },
            ],
        },
    };

    export const mobilePhone = {
        name: 'user.wlc-phone-field',
        params: {
            name: ['phoneCode', 'phoneNumber'],
            theme: 'vertical',
            validators: [
                'required',
            ],
        },
        // name: 'core.wlc-input',
        // params: <IInputCParams>{
        //     theme: 'vertical',
        //     common: {
        //         placeholder: gettext('Mobile phone'),
        //     },
        //     name: 'phoneNumber',
        //     customMod: ['phone'],
        //     validators: ['required'],
        // },
    };

    export const bankNameText = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('Bank name'),
            },
            name: 'bankName',
            customMod: ['bank-name'],
            validators: ['required'],
        },
    };

    export const branchCode = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('Branch code'),
            },
            name: 'branchCode',
            customMod: ['branch-code'],
            validators: ['required'],
        },
    };

    export const swift = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('SWIFT'),
            },
            name: 'swift',
            customMod: ['swift'],
            validators: ['required'],
        },
    };

    export const submit = {
        name: 'core.wlc-button',
        params: <IButtonCParams>{
            name: 'submit',
            modifiers: ['submit'],
            common: {
                text: gettext('Save'),
                customModifiers: 'submit',
            },
        },
    };
}
