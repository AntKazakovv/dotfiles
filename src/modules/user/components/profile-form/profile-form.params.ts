import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IFormWrapperCParams} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IProfileFormCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
}

export const defaultParams: IProfileFormCParams = {
    class: 'wlc-profile-form',
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
                        options: new RegExp('^[A-Za-z]'),
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
                validators: ['required'],
                exampleValue: 'Ivanov',
            },
        },
        {
            name: 'core.wlc-select',
            params: {
                common: {
                    placeholder: 'Gender',
                },
                locked: true,
                name: 'gender',
                validators: ['required'],
                options: 'genders',
            },
        },
        {
            name: 'core.wlc-select',
            params: {
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
