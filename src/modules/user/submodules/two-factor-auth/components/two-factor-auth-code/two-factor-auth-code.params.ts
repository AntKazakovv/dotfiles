import {
    CustomType,
    IComponentParams,
    IFormWrapperCParams,
    IButtonCParams,
    IInputCParams,
} from 'wlc-engine/modules/core';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITwoFactorAuthCodeCParams extends IComponentParams<Theme, Type, ThemeMod> {
    title?: string;
    description?: string;
    config?: IFormWrapperCParams;
    authKey?: string;
    responseCode?: number;
}

export const defaultParams: ITwoFactorAuthCodeCParams = {
    moduleName: 'two-factor-auth',
    componentName: 'wlc-two-factor-auth-code',
    class: 'wlc-two-factor-auth-code',
    title: gettext('Google Authenticator'),
    description: gettext('Please enter the 6-digit security code to continue'),
    config: {
        components: [
            {
                name: 'core.wlc-input',
                params: <IInputCParams>{
                    name: 'code2FA',
                    common: {
                        placeholder: gettext('Security code'),
                        autocomplete: 'off',
                    },
                    exampleValue: gettext('Security code'),
                    validators: [
                        'required',
                    ],
                    theme: 'vertical',
                    wlcElement: 'input_2fa-google-code',
                    maskOptions: {
                        mask: '000000',
                    },
                },
            },
            {
                name: 'core.wlc-button',
                params: <IButtonCParams>{
                    name: 'submit',
                    common: {
                        wlcElement: 'button_submit',
                        typeAttr: 'submit',
                        text: gettext('Confirm'),
                    },
                },
            },
        ],
    },
};
