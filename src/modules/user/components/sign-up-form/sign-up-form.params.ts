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

export interface ISignUpFormCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {
        customModifiers?: CustomMod;
    };
    modifiers?: Modifiers[];
}

export const defaultParams: ISignUpFormCParams = {
    class: 'wlc-sign-up-form',
};

export const signUpFormConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'core.wlc-text-block',
            params: {
                common: {
                    textBlockTitle: gettext('Register'),
                    textBlockSubtitle: gettext('Your adventure begins'),
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
                    customModifiers: 'email',
                },
                name: 'email',
                validators: ['required', 'email', 'emailUnique'],
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                theme: 'vertical',
                common: {
                    placeholder: gettext('Password *'),
                    type: 'password',
                    customModifiers: 'right-shift password',
                    usePasswordVisibilityDirective: true,
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
            name: 'core.wlc-select',
            params: {
                labelText: gettext('Currency'),
                options: 'currencies',
                theme: 'vertical',
                common: {
                    placeholder: gettext('Currency'),
                    customModifiers: 'currency',
                },
                validators: ['required'],
                name: 'currency',
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                theme: 'vertical',
                common: {
                    placeholder: gettext('Promocode'),
                    customModifiers: 'promocode',
                },
                name: 'registrationPromoCode',
            },
        },
        {
            name: 'core.wlc-checkbox',
            params: {
                checkboxType: 'terms',
                name: 'agreedWithTermsAndConditions',
                common: {
                    customModifiers: 'terms',
                },
            },
        },
        {
            name: 'core.wlc-checkbox',
            params: {
                checkboxType: 'age',
                name: 'ageConfirmed',
                common: {
                    customModifiers: 'age',
                },
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                common: {
                    text: gettext('Register'),
                    type: 'submit',
                },
            },
        },
        {
            name: 'core.wlc-link-block',
            params: {
                common: {
                    subtitleText: gettext('Already have an account?'),
                    linkText: gettext('Sign in now'),
                    actionParams: {
                        modal: {
                            name: 'login',
                        },
                    },
                },
            },
        },
    ],
};
