import {
    CustomType,
    IComponentParams,
    IButtonCParams,
    IFormWrapperCParams,
    IInputCParams,
} from 'wlc-engine/modules/core';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITwoFactorAuthFinishCParams extends IComponentParams<Theme, Type, ThemeMod> {
    title?: string;
    description?: string;
    config?: IFormWrapperCParams;
}

export const defaultParams: ITwoFactorAuthFinishCParams = {
    moduleName: 'two-factor-auth',
    componentName: 'wlc-two-factor-auth-finish',
    class: 'wlc-two-factor-auth-finish',
    title: gettext('Google Authenticator'),
    description: gettext('Finish the setup by entering a 6-digit code from the Google Authenticator app'),
    config: {
        components: [
            {
                name: 'core.wlc-input',
                params: <IInputCParams>{
                    name: 'securityCode',
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
