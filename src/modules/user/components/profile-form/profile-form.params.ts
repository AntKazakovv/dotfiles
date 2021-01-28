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
                name: 'ibanNumber',
                validators: ['required'],
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: gettext('Password'),
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
