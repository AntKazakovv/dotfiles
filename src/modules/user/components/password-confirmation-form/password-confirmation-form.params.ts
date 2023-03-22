import {
    IComponentParams,
    CustomType,
    IFormWrapperCParams,
    IInputCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IPasswordConfirmationFormCParams extends
    IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    code?: string,
    formConfig: IFormWrapperCParams,
};

export const defaultParams: IPasswordConfirmationFormCParams = {
    class: 'wlc-password-confirmation-form',
    componentName: 'wlc-password-confirmation-form',
    moduleName: 'user',
    formConfig: {
        class: 'wlc-form-wrapper',
        components: [
            {
                name: 'core.wlc-text-block',
                params: {
                    common: {
                        textBlockSubtitle: [
                            gettext('Please enter your account password to complete email verification.'),
                        ],
                    },
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
                    validators: ['required'],
                },
            },
            {
                name: 'core.wlc-button',
                params: {
                    wlcElement: 'button_submit',
                    common: {
                        text: gettext('Confirm'),
                        type: 'submit',
                        customModifiers: 'centered',
                    },
                },
            },
        ],
    },
};

