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

export interface INewPasswordFormCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {
        customModifiers?: CustomMod;
    };
    modifiers?: Modifiers[];
}

export const defaultParams: INewPasswordFormCParams = {
    class: 'wlc-new-password-form',
};

export const newPasswordFormConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'core.wlc-text-block',
            params: {
                common: {
                    textBlockTitle: gettext('Create a new password'),
                },
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
                validators: ['required', 'password',
                    {
                        name: 'minLength',
                        options: 6,
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
                validators: ['required', 'password',
                    {
                        name: 'minLength',
                        options: 6,
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
            options: ['newPassword', 'confirmPassword'],
        },
    ],
};
