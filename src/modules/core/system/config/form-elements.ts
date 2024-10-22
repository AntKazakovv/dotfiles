import {UntypedFormControl} from '@angular/forms';

import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {
    IInputCParams,
    ICheckboxCParams,
    IButtonCParams,
    ISelectCParams,
} from 'wlc-engine/modules/core';
import {
    IClearAmountButtonCParams,
    IPreselectedAmountsCParams,
} from 'wlc-engine/modules/finances';
import {ProhibitedPatterns} from 'wlc-engine/modules/core/constants';
import {ICaptchaCParams} from 'wlc-engine/modules/security/captcha';
import {FormValidators} from 'wlc-engine/modules/core/system/services/validation/validators';

export type TTemplateName = keyof typeof FormElements;

export interface IFieldTemplate {
    template: TTemplateName;
    dbName: string;
    label: string;
    displayOrder: number;
}

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
                type: 'tel',
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
                    text: gettext('The entered amount is more than the maximum'),
                    options: 10000,
                },
            ],
        },
    };

    export const amountWithButtons: IFormComponent = {
        name: 'extra-forms.wlc-amount-field',
        alwaysNew: {
            saveValue: true,
        },
        params: {
            name: ['amount'],
            amount: <IInputCParams>{
                common: {
                    placeholder: gettext('Amount'),
                    customModifiers: 'right-shift',
                    maxLength: 55,
                    type: 'tel',
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
                    text: gettext('The entered amount is more than the maximum'),
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

    export const preselectedAmounts: IFormComponent = {
        name: 'finances.wlc-preselected-amounts',
        params: <IPreselectedAmountsCParams>{
            amounts: [],
        },
    };

    export const clearAmountButton: IFormComponent = {
        name: 'finances.wlc-clear-amount-button',
        params: <IClearAmountButtonCParams>{
            isAmountEmpty: true,
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
                    tooltipText: gettext('E-mail address has been verified'),
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
                {
                    name: 'onlyLatinLetters',
                    projectType: 'wlc',
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
                {
                    name: 'onlyLatinLetters',
                    projectType: 'wlc',
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
                placeholder: gettext('CAPTCHA'),
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
            deepSearch: {
                use: true,
                aliasesType: 'countries',
            },
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
            locked: true,
        },
    };

    export const countryAndState: IFormComponent = {
        name: 'core.wlc-country-and-state',
        params: {
            name: ['countryCode', 'stateCode', 'cpf'],
            locked: ['countryCode', 'cpf', 'stateCode'],
            validatorsField: [
                {
                    name: 'countryCode',
                    validators: 'required',
                },
                {
                    name: 'cpf',
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
            validators: [
                FormValidators.cityMinLength,
                {
                    name: 'onlyLatinLetters',
                    projectType: 'wlc',
                },
            ],
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
            validators: [
                'required',
                {
                    name: 'onlyLatinLetters',
                    projectType: 'wlc',
                },
            ],
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
                tooltipText: gettext('Politically exposed person'),
            },
            locked: true,
            name: 'pep',
            validators: [],
            options: 'pep',
            customMod: ['pep-select'],
        },
    };

    export const ibanNumber: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            common: {
                placeholder: gettext('IBAN number'),
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
        name: 'forms.wlc-phone-field',
        params: {
            name: ['phoneCode', 'phoneNumber'],
            theme: 'vertical',
            locked: true,
            validators: ['required'],
        },
    };

    export const mobilePhoneWithCode: IFormComponent = {
        name: 'forms.wlc-phone-field',
        params: {
            phoneCode: {
                labelText: gettext('Phone code'),
                theme: 'vertical',
            },
            phoneNumber: {
                theme: 'vertical',
            },
            name: ['phoneCode', 'phoneNumber'],
            validators: ['required'],
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
            wlcElement: 'profile_form_submit-btn',
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

    export const logoutTime: IFormComponent = {
        name: 'core.wlc-select',
        params: {
            labelText: gettext('User inactivity timeout'),
            options: 'logoutTime',
            wlcElement: 'block_logout-time',
            name: 'logoutTime',
        },
    };

    export const promocodeWithLink: IFormComponent = {
        name: 'core.wlc-promocode-link',
        params: {
            name: ['registrationPromoCode'],
            validatorsField: [
                {
                    name: 'registrationPromoCode',
                    validators: [
                        FormValidators.tagReg,
                        FormValidators.maxLength,
                        FormValidators.emojiReg,
                    ],
                },
            ],
        },
    };

    export const promocode: IFormComponent = {
        name: 'core.wlc-input',
        params: {
            theme: 'vertical',
            wlcElement: 'block_promocode',
            common: {
                placeholder: gettext('Promo code'),
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
                placeholder: '__.__.__.___.__',
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
                'I would like to receive information about promotions, marketing materials, and personalized content',
            ),
            name: 'emailAgree',
            wlcElement: 'block_email-agree',
            common: {
                customModifiers: 'email-agree',
            },
        },
    };

    export const cpf: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            name: 'cpf',
            customMod: ['cpf'],
            wlcElement: 'block_cpf',
            common: {
                placeholder: '___.___.___-__',
                separateLabel: gettext('CPF'),
            },
            validators: [
                'required',
                FormValidators.cpfPattern,
            ],
            maskOptions: {
                mask: '000.000.000-00',
                overwrite: true,
            },
            locked: true,
        },
    };

    export const cnp: IFormComponent = {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            name: 'cpf',
            customMod: ['cnp'],
            wlcElement: 'block_cnp',
            common: {
                placeholder: '____________',
                separateLabel: gettext('CNP'),
            },
            validators: [
                'required',
                FormValidators.cnpPattern,
            ],
            maskOptions: {
                mask: '0000000000000',
            },
            locked: true,
        },
    };
}

export const formFieldTemplates: Record<string, IFieldTemplate> = {

    login: {
        template: 'login',
        dbName: 'login',
        label: 'Username',
        displayOrder: 1,
    },
    firstName: {
        template: 'firstName',
        dbName: 'Name',
        label: 'First name',
        displayOrder: 2,
    },
    lastName: {
        template: 'lastName',
        dbName: 'LastName',
        label: 'Last name',
        displayOrder: 3,
    },
    birthDay: {
        template: 'birthDate',
        dbName: 'DateOfBirth',
        label: 'Date of birth',
        displayOrder: 5,
    },
    gender: {
        template: 'gender',
        dbName: 'Gender',
        label: 'Gender',
        displayOrder: 4,
    },
    phoneNumber: {
        template: 'mobilePhone',
        dbName: 'Phone',
        label: 'Mobile phone',
        displayOrder: 12,
    },
    countryCode: {
        template: 'countryAndState',
        dbName: 'IDCountry',
        label: 'Country',
        displayOrder: 6,
    },
    stateCode: {
        template: 'state',
        dbName: 'IDState',
        label: 'State',
        displayOrder: 7,
    },
    cpf: {
        template: 'cpf',
        dbName: 'CPF',
        label: 'CPF',
        displayOrder: 8,
    },
    city: {
        template: 'city',
        dbName: 'City',
        label: 'City',
        displayOrder: 9,
    },
    address: {
        template: 'address',
        dbName: 'Address',
        label: 'Address',
        displayOrder: 10,
    },
    postalCode: {
        template: 'postalCode',
        dbName: 'PostalCode',
        label: 'Postal code',
        displayOrder: 11,
    },
    bankName: {
        template: 'bankNameText',
        dbName: 'BankName',
        label: 'Bank name',
        displayOrder: 13,
    },
    branchCode: {
        template: 'branchCode',
        dbName: 'BranchCode',
        label: 'Branch code',
        displayOrder: 14,
    },
    idNumber: {
        template: 'idNumber',
        dbName: 'IDNumber',
        label: 'ID number',
        displayOrder: 17,
    },
    swift: {
        template: 'swift',
        dbName: 'Swift',
        label: 'SWIFT',
        displayOrder: 15,
    },
    ibanNumber: {
        template: 'ibanNumber',
        dbName: 'Iban',
        label: 'Iban number',
        displayOrder: 16,
    },
    email: {
        template: 'email',
        dbName: 'Email',
        label: 'Email',
        displayOrder: 0,
    },
} as const;

export const fieldNameByDbName: Record<IFieldTemplate['dbName'], string>
    = Object.entries(formFieldTemplates).reduce((acc, [key, value]) => {
        return {
            ...acc,
            [value.dbName]: key,
        };
    }, {});
