import {CustomType, IComponentParams} from 'wlc-engine/classes/abstract.component';
import {IFormWrapperCParams} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IProfileFormCParams extends IComponentParams<ComponentTheme, ComponentType, string> {}

export const defaultParams: IProfileFormCParams = {
    class: 'wlc-feedback-form',
};

export const feedbackConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: 'Email',
                },
                name: 'email',
                validators: ['required', 'email'],
                exampleValue: 'dasha.kot@egamings.com',
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: 'First name',
                },
                name: 'firstName',
                validators: ['required'],
                exampleValue: 'Ivan',
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: 'Last name',
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
                name: 'gender',
                validators: ['required'],
                options: 'genders',
            },
        },
        {
            name: 'core.wlc-select',
            params: {
                common: {
                    placeholder: 'Country',
                },
                name: 'countries',
                validators: ['required'],
                options: 'countries',
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: 'City',
                },
                name: 'city',
                validators: ['required'],
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: 'Address',
                },
                name: 'address',
                validators: ['required'],
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: 'Postal code',
                },
                name: 'postalCode',
                validators: ['required'],
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: 'PEP',
                },
                name: 'pep',
                validators: ['required'],
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                name: 'submit',
                common: {
                    text: 'Save changes',
                },
            },
        },
    ],
};
