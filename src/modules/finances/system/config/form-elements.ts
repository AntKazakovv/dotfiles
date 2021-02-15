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
                placeholder: gettext('Amount') + ' *',
                type: 'number',
                customModifiers: 'right-shift',
            },
            exampleValue: gettext('Amount'),
            theme: 'vertical',
            locked: true,
            name: 'amount',
            currency: true,
            validators: [
                'required',
                {
                    name: 'regExp',
                    options: new RegExp('[^0-9]$'),
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

    export const depositButton = {
        name: 'core.wlc-button',
        params: <IButtonCParams>{
            name: 'submit',
            wlcElement: 'button_deposit',
            common: {
                text: gettext('Deposit'),
            },
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
        },
    };

    export const email = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
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
            common: {
                placeholder: gettext('First name'),
            },
            name: 'firstName',
            validators: ['required',
                {
                    name: 'minLength',
                    options: 2,
                },
                {
                    name: 'regExp',
                    options: new RegExp('^[A-Za-z]$'),
                },
            ],
            exampleValue: 'Ivan',
        },
    };

    export const lastName = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            common: {
                placeholder: gettext('Last name'),
            },
            name: 'lastName',
            validators: ['required'],
            exampleValue: 'Ivanov',
        },
    };

    export const gender = {
        name: 'core.wlc-select',
        params: <ISelectCParams>{
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
            common: {
                placeholder: gettext('City'),
            },
            name: 'city',
            validators: [],
        },
    };

    export const address = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            common: {
                placeholder: gettext('Address'),
            },
            name: 'address',
            validators: [],
        },
    };

    export const postalCode =  {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            common: {
                placeholder: gettext('Postal code'),
            },
            name: 'postalCode',
            validators: [],
        },
    };

    export const pep = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            common: {
                placeholder: gettext('PEP'),
            },
            name: 'pep',
            validators: [],
        },
    };

    export const ibanNumber = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            common: {
                placeholder: gettext('Iban number'),
            },
            name: 'ibanNumber',
            validators: ['required'],
        },
    };

    export const password = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            common: {
                placeholder: gettext('Password'),
                type: 'password',
            },
            name: 'currentPassword',
            validators: ['required'],
        },
    };

    export const mobilePhone = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            common: {
                placeholder: gettext('Mobile phone'),
            },
            name: 'mobilePhone',
            validators: ['required'],
        },
    };

    export const submit = {
        name: 'core.wlc-button',
        params: <IButtonCParams>{
            name: 'submit',
            common: {
                text: gettext('Save changes'),
                customModifiers: 'submit',
            },
        },
    };
}
