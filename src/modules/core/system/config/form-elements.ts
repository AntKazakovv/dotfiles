import {UntypedFormControl} from '@angular/forms';

import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {
    IInputCParams,
    ICheckboxCParams,
    IButtonCParams,
    ISelectCParams,
    IValidatorSettings,
} from 'wlc-engine/modules/core';
import {ProhibitedPatterns} from 'wlc-engine/modules/core/constants';
import {ICaptchaCParams} from 'wlc-engine/modules/security/captcha';

const cityMinLengthValidator: IValidatorSettings = {
    name: 'minLength',
    text: gettext('Field length must be more than 2 characters'),
    options: 2,
};

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
                maxLength: 55,
            },
            exampleValue: gettext('Enter amount'),
            theme: 'vertical',
            name: 'amount',
            showCurrency: true,
            prohibitedPattern: ProhibitedPatterns.notAmountSymbols,
            trimStartZeroes: true,
            customMod: ['amount'],
            numeric: {
                use: true,
                scale: 2,
                unsignedOnly: true,
                prohibitRadixAsFirst: true,
            },
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

    export const depositPrestepButton: IFormComponent = {
        name: 'core.wlc-button',
        params: <IButtonCParams>{
            wlcElement: 'button_deposit_prestep',
            common: {
                typeAttr: 'submit',
                text: gettext('Get code'),
            },
            themeMod: 'secondary',
            customMod: ['submit', 'deposit'],
        },
    };

    export const depositButton: IFormComponent = {
        name: 'core.wlc-button',
        params: <IButtonCParams>{
            wlcElement: 'button_deposit',
            common: {
                typeAttr: 'submit',
                text: gettext('Deposit'),
            },
            customMod: ['submit', 'deposit'],
        },
    };

    export const withdrawButton: IFormComponent = {
        name: 'core.wlc-button',
        params: <IButtonCParams>{
            wlcElement: 'button_withdraw',
            common: {
                typeAttr: 'submit',
                text: gettext('Withdraw'),
            },
            customMod: ['submit', 'withdraw'],
        },
    };

    export const email: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams> {
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

    export const profileMail: IFormComponent = {
        name: 'user.wlc-email-field',
        params: {
            name: ['email'],
            validators: ['required', 'email'],
            exampleValue: 'example@mail.com',
            email: {
                common: {
                    tooltipIcon: 'verified-icon',
                    tooltipMod: 'resolve',
                    tooltipText: gettext('Email is verified'),
                },
            },
            wlcElement: 'block_email',
        },
    };

    export const firstName: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('First name'),
            },
            prohibitedPattern: ProhibitedPatterns.notNamesSymbols,
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
            prohibitedPattern: ProhibitedPatterns.notNamesSymbols,
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
        name: 'captcha.wlc-captcha',
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
            autocomplete: 'new-password',
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

    export const state: IFormComponent = {
        name: 'core.wlc-select',
        params: <ISelectCParams>{
            theme: 'vertical',
            labelText: gettext('State'),
            common: {
                placeholder: gettext('State'),
            },
            name: 'stateCode',
            validators: ['required'],
            options: 'states',
            wlcElement: 'block_state',
            customMod: ['state'],
        },
    };

    export const countryAndState: IFormComponent = {
        name: 'core.wlc-country-and-state',
        params: {
            name: ['countryCode', 'stateCode'],
            locked: ['countryCode'],
            validatorsField: [
                {
                    name: 'countryCode',
                    validators: 'required',
                },
            ],
        },
    };

    export const city: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('City'),
            },
            name: 'city',
            validators: [cityMinLengthValidator],
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
        name: 'pep.wlc-pep-select',
        params: <ISelectCParams>{
            class: 'wlc-select',
            labelText: gettext('PEP'),
            control: new UntypedFormControl(''),
            common: {
                placeholder: gettext('PEP'),
                tooltipText: gettext('Politically Exposed Person'),
            },
            locked: true,
            name: 'pep',
            validators: [],
            options: 'pep',
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
            validators: ['required'],
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
            modifiers: ['submit'],
            common: {
                typeAttr: 'submit',
                text: gettext('Save'),
                customModifiers: 'submit',
            },
        },
    };

    export const birthDate: IFormComponent = {
        name: 'core.wlc-birth-field',
        params: {
            theme: 'vertical',
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
                'passwordLength',
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
                'passwordLength',
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
            validators: ['passwordLength'],
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
                typeAttr: 'submit',
            },
        },
    };

    export const idNumber: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('IDNumber'),
            },
            locked: true,
            name: 'idNumber',
            customMod: ['id-number'],
            validators: ['required'],
        },
    };

    export const nationalNumber: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('__.__.__.___.__'),
                separateLabel: gettext('National Registration Number'),
            },
            locked: true,
            name: 'idNumber',
            customMod: ['nationalNumber'],
            validators: [
                'required',
                {
                    name: 'minLength',
                    options: 15,
                },
            ],
            maskOptions: {
                mask: '00-00-00-000-00',
            },
        },
    };

    export const nickName: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('Nickname'),
                autocomplete: 'Nickname',
            },
            locked: true,
            name: 'nick',
            validators: ['required'],
            wlcElement: 'block_nick',
            customMod: ['nick'],
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

    export const emailAgree: IFormComponent = {
        name: 'core.wlc-checkbox',
        params: {
            text: gettext(
                'I would like to receive information about promotions, marketings materials and personalised content',
            ),
            name: 'emailAgree',
            wlcElement: 'block_email-agree',
            common: {
                customModifiers: 'email-agree',
            },
        },
    };
}
