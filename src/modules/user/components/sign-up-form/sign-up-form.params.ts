import {
    CustomType,
    IComponentParams,
    IFormWrapperCParams,
    IIndexing,
} from 'wlc-engine/modules/core';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';

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
    formData?: IIndexing<unknown>;
    /**
     * Uses only for two steps
     */
    formType?: 'secondStep' | null;
}

export const defaultParams: ISignUpFormCParams = {
    class: 'wlc-sign-up-form',
    wlcElement: 'modal_signup',
    componentName: 'wlc-sign-up-form',
    moduleName: 'user',
};

export const signUpFormConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        FormElements.email,
        FormElements.registrationPasswordNew,
        FormElements.currency,
        FormElements.promocode,
        FormElements.terms,
        FormElements.age,
        FormElements.signUp,
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

export const signUpWithLoginFormConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        FormElements.email,
        FormElements.login,
        FormElements.registrationPasswordNew,
        FormElements.currency,
        FormElements.promocode,
        FormElements.terms,
        FormElements.age,
        FormElements.signUp,
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

export const twoStepsFormConfig = {
    components: [
        FormElements.lastName,
        FormElements.firstName,
        FormElements.country,
        FormElements.city,
        FormElements.address,
        FormElements.postalCode,
        FormElements.birthDate,
        FormElements.terms,
        FormElements.signUp,
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
