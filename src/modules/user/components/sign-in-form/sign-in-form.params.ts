import _assign from 'lodash-es/assign';

import {
    CustomType,
    IFormWrapperCParams,
    IInputCParams,
    IButtonCParams,
    ITextBlockCParams,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';

import {
    defaultSignInFormParams,
    IAbstractSignInFormCParams,
} from 'wlc-engine/modules/core/system/classes/sign-in-form-abstract.class';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ISignInFormCParams extends IAbstractSignInFormCParams<ComponentTheme, ComponentType, string> {
    common?: {
        customModifiers?: CustomMod;
    };
    wrapperConfig?: IWrapperCParams;
    modifiers?: Modifiers[];
    formConfig?: IFormWrapperCParams;
}

export const generateConfig = (useLogin: boolean, isKiosk: boolean): IFormWrapperCParams => {
    return {
        class: 'wlc-form-wrapper',
        components: [
            {
                name: 'core.wlc-text-block',
                params: <ITextBlockCParams>{
                    common: {
                        textBlockTitle: isKiosk ? gettext('Sign in') : gettext('Login'),
                        textBlockSubtitle: gettext('Welcome back!'),
                    },
                },
            },
            useLogin ? FormElements.loginEmail : {
                name: 'core.wlc-input',
                params: <IInputCParams>{
                    theme: 'vertical',
                    wlcElement: 'block_email-login',
                    common: {
                        placeholder: gettext('E-mail'),
                        type: 'email',
                    },
                    name: 'email',
                    validators: ['required', 'email'],
                },
            },
            {
                name: 'core.wlc-input',
                params: <IInputCParams>{
                    theme: 'vertical',
                    wlcElement: 'block_password',
                    common: {
                        placeholder: gettext('Password'),
                        type: 'password',
                        customModifiers: 'right-shift',
                        usePasswordVisibilityBtn: true,
                        fixAutoCompleteForm: false,
                    },
                    name: 'password',
                    validators: ['required'],
                },
            },
            !isKiosk ? {
                name: 'user.wlc-restore-link',
                params: {
                    wlcElement: 'button_forgot-password',
                    common: {
                        typeAttr: 'button',
                    },
                },
            } : null,
            {
                name: 'core.wlc-button',
                params: <IButtonCParams>{
                    wlcElement: 'button_login-submit',
                    common: {
                        customModifiers: 'submit',
                        text: gettext('Login'),
                        typeAttr: 'submit',
                    },
                    themeMod: 'secondary',
                },
            },
            !isKiosk ? {
                name: 'core.wlc-link-block',
                params: {
                    wlcElement: 'button_register',
                    common: {
                        subtitle: gettext('Don\'t have an account?'),
                        link: gettext('Sign up now'),
                        actionParams: {
                            modal: {
                                name: 'signup',
                            },
                        },
                    },
                },
            } : null,
        ],
    };
};

export const defaultParams: ISignInFormCParams = _assign(
    {},
    defaultSignInFormParams,
    <ISignInFormCParams>{
        class: 'wlc-sign-in-form',
        moduleName: 'user',
        componentName: 'wlc-sign-in-form',
        wlcElement: 'modal_login',
    },
);
