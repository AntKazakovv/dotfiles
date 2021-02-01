import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

import {IFormWrapperCParams} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {$base} from 'wlc-config/01.base.config';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IRestorePasswordFormCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {
        customModifiers?: CustomMod;
    };
    modifiers?: Modifiers[];
}

export const defaultParams: IRestorePasswordFormCParams = {
    class: 'wlc-restore-password-form',
};

export const restorePasswordFormConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'core.wlc-text-block',
            params: {
                common: {
                    textBlockTitle: gettext('Password restore'),
                    textBlockSubtitle: gettext(`Please enter e-mail that was used to create an account at
                    ${$base.site.url || $base.site.name}.
                    A password reset link will be sent to your e-mail address shortly.`),
                },
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                theme: 'vertical',
                common: {
                    placeholder: gettext('Email *'),
                    type: 'mail',
                },
                name: 'email',
                validators: ['required', 'email', 'emailExist'],
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                common: {
                    text: gettext('Restore'),
                    type: 'submit',
                    customModifiers: 'centered',
                },
            },
        },
        {
            name: 'core.wlc-link-block',
            params: {
                common: {
                    subtitleText: gettext('Don’t have an account?'),
                    linkText: gettext('Register now'),
                    actionParams: {
                        modal: {
                            name: 'signup',
                        },
                    },
                },
            },
        },
    ],
};
