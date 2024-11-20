import {BehaviorSubject} from 'rxjs';

import {
    CustomType,
    IComponentParams,
    IFormComponent,
    IButtonCParams,
    IInputCParams,
} from 'wlc-engine/modules/core';

export type Type = 'default' | 'finish' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITwoFactorAuthCodeCParams extends IComponentParams<Theme, Type, ThemeMod> {
    title?: string;
    description?: string;
    authKey?: string;
    responseCode?: number;
}

export const defaultParams: ITwoFactorAuthCodeCParams = {
    moduleName: 'two-factor-auth',
    componentName: 'wlc-two-factor-auth-code',
    class: 'wlc-two-factor-auth-code',
    title: gettext('Google Authenticator'),
    description: gettext('Please enter the 6-digit security code to continue'),
};

export const inputComponent = {
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
};

export const buttonComponent = {
    name: 'core.wlc-button',
    params: <IButtonCParams>{
        name: 'submit',
        common: {
            wlcElement: 'button_submit',
            typeAttr: 'submit',
            text: gettext('Confirm'),
        },
    },
};

export const components: (pending: BehaviorSubject<boolean>) => IFormComponent[] = (pending) => {
    return [
        inputComponent,
        {
            name: buttonComponent.name,
            params: {
                ...buttonComponent.params,
                pending$: pending,
            },
        },
    ];
};

export const finishDescription: string =
    gettext('Finish the setup by entering a 6-digit code from the Google Authenticator app');
