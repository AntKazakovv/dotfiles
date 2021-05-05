import {
    IInputCParams,
    ICheckboxCParams,
    IButtonCParams,
    ISelectCParams,
} from 'wlc-engine/modules/core';

export namespace FormElements {
    export const amount = {
        name: 'core.wlc-input',
        alwaysNew: {
            saveValue: true,
        },
        params: <IInputCParams>{
            common: {
                placeholder: gettext('Amount'),
                customModifiers: 'right-shift',
                type: 'number',
            },
            exampleValue: gettext('Enter amount'),
            theme: 'vertical',
            locked: true,
            name: 'amount',
            showCurrency: true,
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
            validators: ['requiredTrue'],
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

    export const withdrawButton = {
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
                autocomplete: 'email',
            },
            locked: true,
            name: 'email',
            validators: ['required', 'email'],
            exampleValue: 'example@mail.com',
            wlcElement: 'block_email',
            customMod: ['email'],
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
            wlcElement: 'block_Name',
            locked: true,
            customMod: ['first-name'],
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
            wlcElement: 'block_last-name',
            locked: true,
            customMod: ['last-name'],
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
            wlcElement: 'block_gender',
            customMod: ['gender'],
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
            wlcElement: 'block_country',
            customMod: ['country'],
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
            wlcElement: 'block_city',
            customMod: ['city'],
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
            wlcElement: 'block_address',
            customMod: ['address'],
        },
    };

    export const postalCode = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('Postal code'),
            },
            name: 'postalCode',
            validators: ['required'],
            wlcElement: 'block_postalcode',
            customMod: ['postal-code'],
        },
    };

    export const pep = {
        name: 'core.wlc-select',
        params: <IInputCParams>{
            theme: 'vertical',
            labelText: gettext('PEP'),
            wlcElement: 'block_pep',
            common: {
                placeholder: gettext('PEP'),
                tooltipText: gettext('Politically Exposed Person'),
            },
            locked: true,
            name: 'pep',
            options: 'pep',
            validators: ['required'],
            customMod: ['pep'],
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
            customMod: ['iban-number'],
        },
    };

    export const password = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('Current password'),
                type: 'password',
                customModifiers: 'right-shift',
                usePasswordVisibilityBtn: true,
                autocomplete: 'current-password',
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
            wlcElement: 'block_password-current',
        },
    };

    export const mobilePhone = {
        name: 'user.wlc-phone-field',
        params: {
            name: ['phoneCode', 'phoneNumber'],
            theme: 'vertical',
            locked: true,
            validators: ['required'],
        },
    };

    export const mobilePhoneWithCode = {
        name: 'user.wlc-phone-field',
        params: {
            phoneCode: {
                labelText: gettext('Phone Code'),
                theme: 'vertical',
            },
            phoneNumber: {
                theme: 'vertical',
            },
            name: ['phoneCode', 'phoneNumber'],
            validators: [
                'required',
            ],
            locked: true,
        },
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
            wlcElement: 'block_bankName',
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

    export const birthDate = {
        name: 'core.wlc-birth-field',
        params: {
            theme:'vertical',
            name: ['birthDay', 'birthMonth', 'birthYear'],
            validators: ['required'],
            locked: true,
        },
    };

    export const passwordNew = {
        name: 'core.wlc-input',
        params: {
            theme: 'vertical',
            wlcElement: 'block_password-new',
            common: {
                placeholder: gettext('New password'),
                type: 'password',
                customModifiers: 'right-shift',
                usePasswordVisibilityBtn: true,
                autocomplete: 'new-password',
            },
            name: 'newPassword',
            validators: [
                'password',
                {
                    name: 'minLength',
                    options: 6,
                },
                {
                    name: 'maxLength',
                    options: 50,
                },
            ],
            customMod: ['password-new'],
        },
    };

    export const passwordConfirm = {
        name: 'core.wlc-input',
        params: {
            theme: 'vertical',
            wlcElement: 'block_password-confirm',
            common: {
                placeholder: gettext('Confirm password'),
                type: 'password',
                customModifiers: 'right-shift',
                usePasswordVisibilityBtn: true,
                autocomplete: 'new-password',
            },
            name: 'confirmPassword',
            validators: [
                'password',
                {
                    name: 'minLength',
                    options: 6,
                },
                {
                    name: 'maxLength',
                    options: 50,
                },
            ],
            customMod: ['password-confirm'],
        },
    };

}
