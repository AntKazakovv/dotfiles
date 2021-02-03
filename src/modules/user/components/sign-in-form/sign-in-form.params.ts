import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

import {
    IFormWrapperCParams,
    IInputCParams,
    IButtonCParams,
    ITextBlockCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ISignInFormCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {
        customModifiers?: CustomMod;
    };
    modifiers?: Modifiers[];
}

export const defaultParams: ISignInFormCParams = {
    class: 'wlc-sign-in-form',
    moduleName: 'user',
    componentName: 'wlc-sign-in-form',
};

export const signInFormConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'core.wlc-text-block',
            params: <ITextBlockCParams>{
                common: {
                    textBlockTitle: gettext('Sign in'),
                    textBlockSubtitle: gettext('Welcome back!'),
                },
            },
        },
        {
            name: 'core.wlc-input',
            params: <IInputCParams>{
                theme: 'vertical',
                common: {
                    placeholder: gettext('Email *'),
                    type: 'mail',
                },
                name: 'email',
                validators: ['required', 'email'],
            },
        },
        {
            name: 'core.wlc-input',
            params: <IInputCParams>{
                theme: 'vertical',
                common: {
                    placeholder: gettext('Password *'),
                    type: 'password',
                    customModifiers: 'right-shift',
                    usePasswordVisibilityBtn: true,
                },
                name: 'password',
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
            name: 'user.wlc-restore-link',
            params: {
                common: {
                    typeAttr: 'button',
                },
            },
        },
        {
            name: 'core.wlc-button',
            params: <IButtonCParams>{
                common: {
                    customModifiers: 'submit',
                    text: gettext('Login'),
                    typeAttr: 'submit',
                },
                themeMod: 'secondary',
            },
        },
        {
            name: 'core.wlc-link-block',
            params: {
                common: {
                    subtitle: gettext('Don’t have an account?'),
                    link: gettext('Sign up now'),
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
