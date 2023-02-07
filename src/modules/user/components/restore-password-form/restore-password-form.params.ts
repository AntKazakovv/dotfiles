import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

import {IFormWrapperCParams} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {$base} from 'wlc-config/01.base.config';
import {
    GlobalHelper,
    IInputCParams,
} from 'wlc-engine/modules/core';

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
                    textBlockSubtitle: [
                        gettext('Please enter e-mail that was used to create an account at'),
                        $base.site.url || $base.site.name + '. ',
                        gettext('A password reset link will be sent to your e-mail address shortly.'),
                    ],
                },
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                theme: GlobalHelper.isMobileApp() ? 'mobile-app' : 'vertical',
                common: {
                    placeholder: gettext('E-mail'),
                    type: 'email',
                },
                name: 'email',
                validators: ['required', 'email'],
                wlcElement: 'input_restore-userlogin',
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                common: {
                    text: gettext('Restore'),
                    type: 'submit',
                    typeAttr: 'submit',
                    customModifiers: 'centered restore',
                },
                wlcElement: 'button_restore',
            },
        },
        {
            name: 'core.wlc-link-block',
            params: {
                common: {
                    subtitle: gettext('Don\'t have an account?'),
                    link: gettext('Sign up now'),
                    actionParams: {
                        modal: {
                            name: 'signup',
                        },
                    },
                },
                wlcElement: 'register_block',
            },
        },
    ],
};

export const restorePasswordWithPhoneFormConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'core.wlc-text-block',
            params: {
                common: {
                    textBlockSubtitle: [
                        gettext('Please enter the e-mail or phone number (without country code) '
                        + 'that is linked to your account on'),
                        $base.site.url || $base.site.name + '. ',
                        gettext('We will send you a link or a reset code.'),
                    ],
                },
            },
        },
        {
            name: 'core.wlc-input',
            params: <IInputCParams>{
                name: 'emailOrPhone',
                common: {
                    placeholder: gettext('E-mail or phone (without country code)'),
                    type: 'text',
                    autocomplete: 'email',
                },
                exampleValue: gettext('E-mail or phone'),
                validators: [
                    'required',
                    'emailOrPhone',
                ],
                theme: GlobalHelper.isMobileApp() ? 'mobile-app' : 'vertical',
                wlcElement: 'input_restore-userlogin',
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                common: {
                    text: gettext('Restore'),
                    type: 'submit',
                    customModifiers: 'centered restore',
                },
                wlcElement: 'button_restore',
            },
        },
        {
            name: 'core.wlc-link-block',
            params: {
                common: {
                    subtitle: gettext('Don\'t have an account?'),
                    link: gettext('Sign up now'),
                    actionParams: {
                        modal: {
                            name: 'signup',
                        },
                    },
                },
                wlcElement: 'register_block',
            },
        },
    ],
};
