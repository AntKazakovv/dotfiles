import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

import {IFormWrapperCParams} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IChangePasswordFormCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {
        customModifiers?: CustomMod;
    };
    modifiers?: Modifiers[];
}

export const defaultParams: IChangePasswordFormCParams = {
    class: 'wlc-change-password-form',
};

export const changePasswordFormConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'core.wlc-text-block',
            params: {
                common: {
                    textBlockTitle: gettext('Change password'),
                },
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                theme: 'vertical',
                common: {
                    placeholder: gettext('Current password'),
                    type: 'password',
                    customModifiers: 'right-shift',
                    usePasswordVisibilityDirective: true,
                },
                name: 'currentPassword',
                validators: ['required',
                    {
                        name: 'minLength',
                        options: 6,
                    },
                    {
                        name: 'maxLength',
                        options: 50,
                    },
                ],
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                theme: 'vertical',
                common: {
                    placeholder: gettext('New password'),
                    type: 'password',
                    customModifiers: 'right-shift',
                    usePasswordVisibilityDirective: true,
                },
                name: 'newPassword',
                validators: ['required',
                    {
                        name: 'minLength',
                        options: 6,
                    },
                    {
                        name: 'maxLength',
                        options: 50,
                    },
                ],
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                theme: 'vertical',
                common: {
                    placeholder: gettext('Confirm password'),
                    type: 'password',
                    customModifiers: 'right-shift',
                    usePasswordVisibilityDirective: true,
                },
                name: 'confirmPassword',
                validators: ['required',
                    {
                        name: 'minLength',
                        options: 6,
                    },
                    {
                        name: 'maxLength',
                        options: 50,
                    },
                ],
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                theme: 'default',
                common: {
                    text: gettext('Save'),
                    type: 'submit',
                    customModifiers: 'centered',
                },
            },
        },
    ],
    validators: [
        {
            name: 'matchingFields',
            options: ['currentPassword', 'confirmPassword'],
        },
    ],
};
