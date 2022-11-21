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
    config: IFormWrapperCParams;
}

export const defaultParams: IChangePasswordFormCParams = {
    class: 'wlc-change-password-form',
    config: {
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
                    wlcElement: 'block_password-current',
                    common: {
                        placeholder: gettext('Current password'),
                        type: 'password',
                        customModifiers: 'right-shift',
                        usePasswordVisibilityBtn: true,
                    },
                    name: 'currentPassword',
                    validators: [
                        'required',
                        'password',
                    ],
                },
            },
            {
                name: 'core.wlc-input',
                params: {
                    theme: 'vertical',
                    wlcElement: 'block_password-new',
                    common: {
                        placeholder: gettext('New password'),
                        type: 'password',
                        customModifiers: 'right-shift',
                        usePasswordVisibilityBtn: true,
                    },
                    name: 'newPassword',
                    validators: [
                        'required',
                        'password',
                        'passwordLength',
                    ],
                },
            },
            {
                name: 'core.wlc-input',
                params: {
                    theme: 'vertical',
                    wlcElement: 'block_password-confirm',
                    common: {
                        placeholder: gettext('Confirm password'),
                        type: 'password',
                        customModifiers: 'right-shift',
                        usePasswordVisibilityBtn: true,
                    },
                    name: 'newPasswordRepeat',
                    validators: [
                        'required',
                        'passwordLength',
                    ],
                },
            },
            {
                name: 'core.wlc-button',
                params: {
                    wlcElement: 'button_submit',
                    common: {
                        text: gettext('Save'),
                        type: 'submit',
                        typeAttr: 'submit',
                        customModifiers: 'centered',
                    },
                },
            },
        ],
        validators: [
            {
                name: 'matchingFields',
                options: ['newPassword', 'newPasswordRepeat'],
            },
        ],
    },
};
