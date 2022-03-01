import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {
    IInputCParams,
    ICheckboxCParams,
    IButtonCParams,
    ISelectCParams,
    ICaptchaCParams,
} from 'wlc-engine/modules/core';

export namespace FormElements {
    export const amount: IFormComponent = {
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
            prohibitedPattern: /[^\d,.]/,
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

    export const rules: IFormComponent = {
        name: 'core.wlc-checkbox',
        params: <ICheckboxCParams>{
            name: 'paymentRules',
            checkboxType: 'payment-rules',
            validators: ['requiredTrue'],
            customMod: ['rules'],
        },
    };

    export const depositButton: IFormComponent = {
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

    export const withdrawButton: IFormComponent = {
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

    export const email: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('E-mail'),
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

    export const firstName: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('First name'),
            },
            prohibitedPattern: /[\d!"#$%&'()*+,.\/:;<=>?@[\\\]^_`{|}~¡¿÷ˆ№]/g,
            name: 'firstName',
            validators: [
                'required',
                'allowLettersOnly',
                {
                    name: 'maxLength',
                    options: 25,
                },
            ],
            wlcElement: 'block_Name',
            locked: true,
            customMod: ['first-name'],
        },
    };

    export const lastName: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('Last name'),
            },
            prohibitedPattern: /[\d!"#$%&'()*+,.\/:;<=>?@[\\\]^_`{|}~¡¿÷ˆ№]/g,
            name: 'lastName',
            validators: [
                'required',
                'allowLettersOnly',
                {
                    name: 'maxLength',
                    options: 25,
                },
            ],
            wlcElement: 'block_last-name',
            locked: true,
            customMod: ['last-name'],
        },
    };

    export const gender: IFormComponent = {
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

    export const captcha: IFormComponent = {
        name: 'core.wlc-captcha',
        params: <ICaptchaCParams>{},
    };

    export const captchaInput: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('Captcha'),
                customModifiers: 'captcha',
            },
            name: 'captcha',
            validators: ['required'],
            wlcElement: 'block_captcha',
        },
    };

    export const country: IFormComponent = {
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
            useSearch: true,
            insensitiveSearch: true,
            noResultText: gettext('No results available'),
        },
    };

    export const countryCode = country;

    export const city: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('City'),
            },
            name: 'city',
            validators: ['required', 'onlyLetters'],
            wlcElement: 'block_city',
            customMod: ['city'],
        },
    };

    export const address: IFormComponent = {
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

    export const postalCode: IFormComponent = {
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

    export const pep: IFormComponent = {
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

    export const ibanNumber: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('Iban number'),
                autocomplete: 'off',
            },
            name: 'ibanNumber',
            validators: ['required'],
            customMod: ['iban-number'],
        },
    };

    export const password: IFormComponent = {
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

    export const mobilePhone: IFormComponent = {
        name: 'user.wlc-phone-field',
        params: {
            name: ['phoneCode', 'phoneNumber'],
            theme: 'vertical',
            locked: true,
            validators: ['required'],
        },
    };

    export const mobilePhoneWithCode: IFormComponent = {
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

    export const bankNameText: IFormComponent = {
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

    export const branchCode: IFormComponent = {
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

    export const swift: IFormComponent = {
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

    export const submit: IFormComponent = {
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

    export const birthDate: IFormComponent = {
        name: 'core.wlc-birth-field',
        params: {
            theme:'vertical',
            name: ['birthDay', 'birthMonth', 'birthYear'],
            validators: ['required'],
            locked: true,
        },
    };

    export const passwordNew: IFormComponent = {
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
            name: 'password',
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

    export const registrationPasswordNew: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            wlcElement: 'block_password-new',
            common: {
                placeholder: gettext('Password'),
                type: 'password',
                customModifiers: 'right-shift',
                usePasswordVisibilityBtn: true,
                autocomplete: 'new-password',
                fixAutoCompleteForm: false,
            },
            name: 'password',
            validators: [
                'required',
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

    export const passwordConfirm: IFormComponent = {
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
            name: 'newPasswordRepeat',
            validators: [
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

    export const currency: IFormComponent = {
        name: 'core.wlc-select',
        params: {
            labelText: gettext('Currency'),
            options: 'currencies',
            theme: 'vertical',
            wlcElement: 'block_currency',
            common: {
                customModifiers: 'currency',
            },
            validators: ['required'],
            name: 'currency',
        },
    };

    export const promocode: IFormComponent = {
        name: 'core.wlc-input',
        params: {
            theme: 'vertical',
            wlcElement: 'block_promocode',
            common: {
                placeholder: gettext('Promocode'),
                customModifiers: 'promocode',
            },
            name: 'registrationPromoCode',
        },
    };

    export const terms: IFormComponent = {
        name: 'core.wlc-checkbox',
        params: {
            checkboxType: 'terms',
            name: 'agreedWithTermsAndConditions',
            wlcElement: 'block_rules',
            common: {
                customModifiers: 'terms',
            },
            validators: ['requiredTrue'],
        },
    };

    export const privacy: IFormComponent = {
        name: 'core.wlc-checkbox',
        params: {
            checkboxType: 'privacy-policy',
            name: 'agreedWithPrivacyPolicy',
            wlcElement: 'block_rules',
            common: {
                customModifiers: 'privacy',
            },
            validators: ['requiredTrue'],
        },
    };

    export const age: IFormComponent = {
        name: 'core.wlc-checkbox',
        params: {
            checkboxType: 'age',
            name: 'ageConfirmed',
            wlcElement: 'block_age-confirm',
            common: {
                customModifiers: 'age',
            },
            validators: ['requiredTrue'],
        },
    };

    export const signUp: IFormComponent = {
        name: 'core.wlc-button',
        params: {
            wlcElement: 'button_register-submit',
            common: {
                text: gettext('Sign up'),
                type: 'submit',
            },
        },
    };

    export const idNumber: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('ID number'),
            },
            name: 'idNumber',
            customMod: ['id-number'],
            validators: ['required'],
        },
    };

    export const login: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('Username'),
                autocomplete: 'Username',
            },
            locked: true,
            name: 'login',
            validators: ['required', 'login'],
            wlcElement: 'block_login',
            customMod: ['login'],
        },
    };

    export const loginEmail: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            wlcElement: 'block_email-login',
            common: {
                placeholder: gettext('Username or E-mail'),
            },
            name: 'email',
            validators: ['required', 'loginEmail'],
        },
    };
}
