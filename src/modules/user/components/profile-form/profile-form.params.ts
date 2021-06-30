import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    IFormWrapperCParams,
    ISelectCParams,
    IInputCParams,
    IIndexing,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type AdditionalBlockItemsType = 'emailNotification' | 'passwordRestore' | 'bankingInfo';

export interface IFieldComponentParams {
    params: IInputCParams | ISelectCParams;
}

export interface IAdditionalBlock {
    title: string;
    use: boolean;
}

export interface IProfileFormCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {
        additionalBlockItems?: AdditionalBlockItemsType[],
    },
    config: IFormWrapperCParams,
    additionalBlocks: IIndexing<IAdditionalBlock>,
}

export const defaultParams: IProfileFormCParams = {
    class: 'wlc-profile-form',
    componentName: 'wlc-profile-form',
    moduleName: 'user',
    common: {},
    config: {
        class: 'wlc-form-wrapper',
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
            {
                name: 'core.wlc-input',
                params: <IInputCParams>{
                    common: {
                        placeholder: gettext('First name'),
                    },
                    wlcElement: 'block_Name',
                    name: 'firstName',
                    locked: true,
                    prohibitedPattern: /[\d!"#$%&()*+,./:;<=>?@[\\\]^_{|}~¡¿÷ˆ№]/,
                    validators: [
                        'required',
                        {
                            name: 'minLength',
                            options: 2,
                        },
                        {
                            name: 'pattern',
                            options: /[^\d!"#$%&()*+,./:;<=>?@[\\\]^_{|}~¡¿÷ˆ№]/,
                        },
                    ],
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
                    prohibitedPattern: /[\d!"#$%&()*+,./:;<=>?@[\\\]^_{|}~¡¿÷ˆ№]/,
                    validators: [
                        'required',
                        {
                            name: 'minLength',
                            options: 2,
                        },
                        {
                            name: 'pattern',
                            options: /[^\d!"#$%&()*+,./:;<=>?@[\\\]^_{|}~¡¿÷ˆ№]/,
                        },
                    ],
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
                name: 'core.wlc-select',
                params: <ISelectCParams>{
                    labelText: gettext('Country'),
                    wlcElement: 'block_country',
                    common: {
                        placeholder: gettext('Country'),
                    },
                    locked: true,
                    name: 'countryCode',
                    validators: ['required'],
                    options: 'countries',
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
                    // validators: [
                    //     'required',
                    //     {
                    //         name: 'minLength',
                    //         options: 6,
                    //     },
                    // ],
                    locked: true,
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
    },
    additionalBlocks: {
        subscriptions: {
            title: gettext('Subscriptions'),
            use: true,
        },
        security: {
            title: gettext('Security'),
            use: true,
        },
        banking: {
            title: gettext('Banking information'),
            use: true,
        },
    },
};
