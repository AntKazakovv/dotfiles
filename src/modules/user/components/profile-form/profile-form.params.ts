import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IFormWrapperCParams} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {ISelectParams} from 'wlc-engine/modules/core';
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
                validators: ['required',
                    {
                        name: 'minLength',
                        options: 2,
                    },
                    {
                        name: 'regExp',
                        options: new RegExp('[^A-Za-z]'),
                    },
                ],
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
                validators: ['required',
                    {
                        name: 'minLength',
                        options: 2,
                    },
                    {
                        name: 'regExp',
                        options: new RegExp('[^A-Za-z]'),
                    },
                ],
                exampleValue: 'Ivanov',
            },
        },
        {
            name: 'core.wlc-select',
            params: <ISelectParams>{
                labelText: gettext('Gender'),
                wlcElement: 'block_gender',
                common: {
                    placeholder: gettext('Gender'),
                },
                locked: true,
                name: 'gender',
                validators: ['required'],
                options: 'genders',
            },
        },
        {
            name: 'core.wlc-select',
            params: <ISelectParams>{
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
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: gettext('PEP'),
                },
                wlcElement: 'block_pep',
                name: 'pep',
                validators: [],
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: gettext('Iban number'),
                },
                wlcElement: 'block_iban',
                name: 'ibanNumber',
                validators: ['required'],
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: gettext('Password'),
                    wlcElement: 'block_password',
                    type: 'password',
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
