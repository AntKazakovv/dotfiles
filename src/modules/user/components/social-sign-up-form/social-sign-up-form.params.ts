import {
    IComponentParams,
    CustomType,
    IFormWrapperCParams,
    IIndexing,
    IInputCParams,
} from 'wlc-engine/modules/core';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ISocialSignUpFormCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    formConfig?: IFormWrapperCParams;
    formData?: IIndexing<unknown>;
};

export const defaultParams: ISocialSignUpFormCParams = {
    class: 'wlc-social-sign-up-form',
    componentName: 'wlc-social-sign-up-form',
    moduleName: 'user',
    wlcElement: 'modal_social_signup',
};

export const socialSignUpFormConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: FormElements.firstName.name,
            params: {
                ...FormElements.firstName.params,
                locked: false,
            },
        },
        {
            name: FormElements.lastName.name,
            params: {
                ...FormElements.lastName.params,
                locked: false,
            },
        },
        {
            name: FormElements.email.name,
            params: {
                ...FormElements.email.params,
                locked: false,
                validators: ['required', 'email'],
            },
        },
        {
            name: 'core.wlc-input',
            params: <IInputCParams>{
                theme: 'vertical',
                wlcElement: 'block_password-current',
                common: {
                    placeholder: gettext('Password'),
                    type: 'password',
                    customModifiers: 'right-shift password',
                    fixAutoCompleteForm: false,
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
        FormElements.currency,
        FormElements.promocode,
        FormElements.terms,
        FormElements.age,
        FormElements.signUp,
    ],
};
