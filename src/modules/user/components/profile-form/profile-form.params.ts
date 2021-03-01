import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IFormWrapperCParams} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {ISelectCParams} from 'wlc-engine/modules/core';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type AdditionalBlockItemsType = 'emailNotification' | 'passwordRestore' | 'bankingInfo';

export interface IAdditionalBlock {
    title: string;
    use: boolean;
}

export interface IProfileFormCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {
        additionalBlockItems?: AdditionalBlockItemsType[],
    },
}

export const defaultParams: IProfileFormCParams = {
    class: 'wlc-profile-form',
    common: {},
};

export const profileForm: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: gettext('Email'),
                },
                wlcElement: 'block_email',
                locked: true,
                name: 'email',
                validators: ['required', 'email'],
                exampleValue: 'dasha.kot@egamings.com',
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: gettext('First name'),
                },
                wlcElement: 'block_Name',
                name: 'firstName',
                locked: true,
                validators: [
                    'required',
                    {
                        name: 'minLength',
                        options: 2,
                    },
                ],
                maskOptions: {
                    mask: 'textField',
                },
                exampleValue: 'Ivan',
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: gettext('Last name'),
                },
                wlcElement: 'block_last-name',
                name: 'lastName',
                locked: true,
                validators: [
                    'required',
                    {
                        name: 'minLength',
                        options: 2,
                    },
                ],
                maskOptions: {
                    mask: 'textField',
                },
                exampleValue: 'Ivanov',
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
            params: {
                common: {
                    placeholder: gettext('City'),
                },
                wlcElement: 'block_city',
                name: 'city',
                validators: [],
                maskOptions: {
                    mask: 'textField',
                },
            },
        },
        {
            name: 'core.wlc-input',
            params: {
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
            params: {
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
                validators: ['required'],
                locked: true,
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: gettext('Password'),
                    wlcElement: 'block_password',
                    type: 'password',
                    customModifiers: 'right-shift',
                    usePasswordVisibilityBtn: true,
                },
                name: 'currentPassword',
                validators: ['required', 'password'],
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

export const AdditionalBlock: IIndexing<IAdditionalBlock> = {
    subscriptions: {
        title: gettext('Subscriptions'),
        use: true,
    },
    security: {
        title: gettext('Security'),
        use: true,
    },
};
