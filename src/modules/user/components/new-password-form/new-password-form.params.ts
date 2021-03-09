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
        code?: string;
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
            name: 'core.wlc-input',
            params: {
                theme: 'vertical',
                common: {
                    placeholder: gettext('New password'),
                    type: 'password',
                    customModifiers: 'right-shift',
                    usePasswordVisibilityBtn: true,
                },
                wlcElement: 'block_password-new',
                name: 'newPassword',
                validators: ['required', 'password',
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
                    usePasswordVisibilityBtn: true,
                },
                wlcElement: 'block_password-confirm',
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
                common: {
                    text: gettext('Save'),
                    type: 'submit',
                    customModifiers: 'centered',
                },
                wlcElement: 'button_submit',
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
