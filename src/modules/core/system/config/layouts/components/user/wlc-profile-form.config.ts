import {ILayoutComponent} from 'wlc-engine/modules/core';
import {
    IFormWrapperCParams,
    IInputCParams,
    ISelectCParams,
    IWrapperCParams,
    IFormComponent,
} from 'wlc-engine/modules/core';
import {IProfileFormCParams} from 'wlc-engine/modules/user';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';

const insertLogin = (useLogin: boolean): IFormComponent | null => {
    if (useLogin) {
        return FormElements.login;
    }

    return null;
};

export namespace wlcProfileForm {
    export const generateFirstProfileConfig = (useLogin: boolean): IFormWrapperCParams => {
        return {
            components: [
                {
                    name: 'core.wlc-wrapper',
                    params: <IWrapperCParams>{
                        class: 'wlc-profile-form__block wlc-profile-form__block--main',
                        components: [
                            {
                                name: 'core.wlc-title',
                                params: {
                                    mainText: gettext('Main info'),
                                    wlcElement: 'header_edit-main-info',
                                },
                            },
                            FormElements.firstName,
                            FormElements.lastName,
                            FormElements.email,
                            insertLogin(useLogin),
                            {
                                name: FormElements.mobilePhone.name,
                                params: {
                                    ...FormElements.mobilePhone.params,
                                    showVerification: true,
                                    phoneCode: {
                                        common: {
                                            tooltipIcon: 'verified-icon',
                                            tooltipMod: 'resolve',
                                            tooltipText: gettext('The phone has been successfully verified'),
                                        },
                                    },
                                },
                            },
                            FormElements.birthDate,
                            FormElements.gender,
                            {
                                name: FormElements.pep.name,
                                params: {
                                    ...FormElements.pep.params,
                                    validators: null,
                                },
                            },
                        ],
                    },
                },
                {
                    name: 'core.wlc-wrapper',
                    params: <IWrapperCParams>{
                        class: 'wlc-profile-form__block wlc-profile-form__block--location',
                        components: [
                            {
                                name: 'core.wlc-title',
                                params: {
                                    mainText: gettext('Location'),
                                    wlcElement: 'header_edit-location',
                                },
                            },
                            FormElements.country,
                            {
                                name: FormElements.postalCode.name,
                                params: {
                                    ...FormElements.postalCode.params,
                                    validators: null,
                                },
                            },
                            {
                                name: FormElements.city.name,
                                params: {
                                    ...FormElements.city.params,
                                    validators: null,
                                    maskOptions: 'textField',
                                },
                            },
                            {
                                name: FormElements.address.name,
                                params: {
                                    ...FormElements.address.params,
                                    validators: null,
                                },
                            },
                        ],
                    },
                },
                {
                    name: 'core.wlc-wrapper',
                    params: <IWrapperCParams>{
                        class: 'wlc-profile-form__block wlc-profile-form__block--banking',
                        components: [
                            {
                                name: 'core.wlc-title',
                                params: {
                                    mainText: gettext('Banking information'),
                                    wlcElement: 'header_edit-banking-information',
                                },
                            },
                            {
                                name: FormElements.bankNameText.name,
                                params: {
                                    ...FormElements.bankNameText.params,
                                    validators: null,
                                },
                            },
                            {
                                name: FormElements.branchCode.name,
                                params: {
                                    ...FormElements.branchCode.params,
                                    validators: null,
                                },
                            },
                            {
                                name: FormElements.swift.name,
                                params: {
                                    ...FormElements.swift.params,
                                    validators: null,
                                },
                            },
                            {
                                name: FormElements.ibanNumber.name,
                                params: {
                                    ...FormElements.ibanNumber.params,
                                    validators: null,
                                },
                            },
                        ],
                    },
                },
                {
                    name: 'core.wlc-wrapper',
                    params: <IWrapperCParams> {
                        class: 'wlc-profile-form__block wlc-profile-form__block--password',
                        components: [
                            {
                                name: 'core.wlc-title',
                                params: {
                                    mainText: gettext('Password'),
                                    wlcElement: 'header_edit-password',
                                },
                            },
                            FormElements.password,
                            {
                                name: 'core.wlc-wrapper',
                                params: <IWrapperCParams> {
                                    class: 'wlc-profile-form__block',
                                    components: [
                                        FormElements.passwordNew,
                                        FormElements.passwordConfirm,
                                    ],
                                },
                            },
                        ],
                    },
                },
                {
                    name: 'core.wlc-wrapper',
                    params: <IWrapperCParams>{
                        class: 'wlc-profile-form__block wlc-profile-form__block--submit',
                        components: [
                            FormElements.submit,
                        ],
                    },
                },
            ],
            validators: [
                {
                    name: 'matchingFields',
                    options: ['password', 'newPasswordRepeat'],
                },
            ],
        };
    };

    export const generateDefaultProfileConfig = (useLogin: boolean): IFormWrapperCParams => {
        return {
            components: [
                {
                    name: 'core.wlc-input',
                    params: <IInputCParams>{
                        common: {
                            placeholder: gettext('E-mail'),
                        },
                        wlcElement: 'block_email',
                        locked: true,
                        name: 'email',
                        validators: ['required', 'email'],
                        exampleValue: 'example@mail.com',
                    },
                },
                insertLogin(useLogin),
                {
                    name: 'core.wlc-input',
                    params: <IInputCParams>{
                        common: {
                            placeholder: gettext('First name'),
                        },
                        wlcElement: 'block_Name',
                        name: 'firstName',
                        locked: true,
                        prohibitedPattern: /[\d!"#$%&()*+,./:;<=>?@[\\\]^_{|}~¡¿÷ˆ№]/g,
                        validators: ['required'],
                        exampleValue: gettext('Enter your name'),
                    },
                },
                {
                    name: 'core.wlc-input',
                    params: <IInputCParams>{
                        common: {
                            placeholder: gettext('Last name'),
                        },
                        wlcElement: 'block_last-name',
                        name: 'lastName',
                        locked: true,
                        prohibitedPattern: /[\d!"#$%&()*+,./:;<=>?@[\\\]^_{|}~¡¿÷ˆ№]/g,
                        validators: ['required'],
                        exampleValue: gettext('Enter your last name'),
                    },
                },
                {
                    name: 'core.wlc-select',
                    params: <ISelectCParams>{
                        labelText: gettext('Sex'),
                        wlcElement: 'block_gender',
                        common: {
                            placeholder: gettext('Sex'),
                        },
                        locked: true,
                        name: 'gender',
                        validators: ['required'],
                        options: 'genders',
                    },
                },
                {
                    name: 'core.wlc-birth-field',
                    params: {
                        name: ['birthDay', 'birthMonth', 'birthYear'],
                        validators: ['required'],
                        locked: true,
                    },
                },
                {
                    name: 'core.wlc-country-and-state',
                    params: {
                        name:  ['countryCode', 'stateCode'],
                        locked: ['countryCode'],
                        validatorsField: [{
                            name: 'countryCode',
                            validators: 'required',
                        }],
                    },
                },
                {
                    name: 'core.wlc-input',
                    params: <IInputCParams>{
                        common: {
                            placeholder: gettext('City'),
                        },
                        wlcElement: 'block_city',
                        name: 'city',
                        validators: [],
                        maskOptions: 'textField',
                    },
                },
                {
                    name: 'core.wlc-input',
                    params: <IInputCParams>{
                        common: {
                            placeholder: gettext('Address'),
                        },
                        wlcElement: 'block_address',
                        name: 'address',
                        validators: [],
                    },
                },
                {
                    name: 'core.wlc-input',
                    params: <IInputCParams>{
                        common: {
                            placeholder: gettext('Postal code'),
                        },
                        wlcElement: 'block_postalcode',
                        name: 'postalCode',
                        validators: [],
                    },
                },
                {
                    name: 'core.wlc-select',
                    params: <ISelectCParams>{
                        labelText: gettext('PEP'),
                        wlcElement: 'block_pep',
                        common: {
                            placeholder: gettext('PEP'),
                            tooltipText: gettext('Politically Exposed Person'),
                        },
                        locked: true,
                        name: 'pep',
                        validators: [],
                        options: 'pep',
                    },
                },
                {
                    name: 'user.wlc-phone-field',
                    params: {
                        name: ['phoneCode', 'phoneNumber'],
                        locked: true,
                        showVerification: true,
                        phoneCode: {
                            common: {
                                tooltipIcon: 'verified-icon',
                                tooltipMod: 'resolve',
                                tooltipText: gettext('The phone has been successfully verified'),
                            },
                        },
                    },
                },
                {
                    name: 'core.wlc-input',
                    params: <IInputCParams>{
                        common: {
                            placeholder: gettext('Password'),
                            wlcElement: 'block_password',
                            type: 'password',
                            customModifiers: 'right-shift',
                            usePasswordVisibilityBtn: true,
                        },
                        name: 'currentPassword',
                        validators: ['required'],
                    },
                },
                {
                    name: 'core.wlc-button',
                    params: {
                        name: 'submit',
                        wlcElement: 'button_submit',
                        common: {
                            text: gettext('Save changes'),
                        },
                    },
                },
            ],
        };
    };

    export const def: ILayoutComponent = {
        name: 'user.wlc-profile-form',
    };

    export const kiosk: ILayoutComponent = {
        name: 'user.wlc-profile-form',
        params: <IProfileFormCParams>{
            config: <IFormWrapperCParams>{
                class: 'wlc-form-wrapper',
                components: [
                    {
                        name: 'core.wlc-wrapper',
                        params: <IWrapperCParams>{
                            class: 'wlc-profile-form__block wlc-profile-form__block--password',
                            components: [
                                {
                                    name: 'core.wlc-title',
                                    params: {
                                        mainText: gettext('Password'),
                                        wlcElement: 'header_edit-password',
                                    },
                                },
                                FormElements.password,
                                {
                                    name: 'core.wlc-wrapper',
                                    params: <IWrapperCParams>{
                                        class: 'wlc-profile-form__block',
                                        components: [
                                            FormElements.passwordNew,
                                            FormElements.passwordConfirm,
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        name: 'core.wlc-wrapper',
                        params: <IWrapperCParams>{
                            class: 'wlc-profile-form__block wlc-profile-form__block--submit',
                            components: [
                                FormElements.submit,
                            ],
                        },
                    },
                ],
                validators: [
                    {
                        name: 'matchingFields',
                        options: ['password', 'newPasswordRepeat'],
                    },
                ],
            },
        },
    };
}
