import {
    CustomType,
    IComponentParams,
    IFormWrapperCParams,
    IUserProfile,
} from 'wlc-engine/modules/core';

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
    formConfig?: IFormWrapperCParams;
}

export const defaultParams: ISignUpFormCParams = {
    class: 'wlc-sign-up-form',
    wlcElement: 'modal_signup',
    componentName: 'wlc-sign-up-form',
    moduleName: 'user',
};

export interface IValidateData {
    'TYPE': string,
    data: Partial<IUserProfile>,
    fields: string[],
};

export const signUpFormConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'core.wlc-input',
            params: {
                theme: 'vertical',
                wlcElement: 'block_email',
                common: {
                    placeholder: gettext('E-mail'),
                    type: 'email',
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
                wlcElement: 'block_password-current',
                common: {
                    placeholder: gettext('Password'),
                    type: 'password',
                    customModifiers: 'right-shift password',
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
            name: 'core.wlc-select',
            params: {
                labelText: gettext('Currency'),
                options: 'currencies',
                theme: 'vertical',
                wlcElement: 'block_currency',
                common: {
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
                wlcElement: 'block_promocode',
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
                wlcElement: 'block_rules',
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
                wlcElement: 'block_age-confirm',
                common: {
                    customModifiers: 'age',
                },
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                wlcElement: 'button_register-submit',
                common: {
                    text: gettext('Sign up'),
                    type: 'submit',
                },
            },
        },
        {
            name: 'core.wlc-link-block',
            params: {
                wlcElement: 'button_login-modal',
                common: {
                    subtitle: gettext('Already have an account?'),
                    link: gettext('Login now'),
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
