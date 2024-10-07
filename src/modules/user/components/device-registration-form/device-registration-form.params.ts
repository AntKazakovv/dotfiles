import {
    CustomType,
    IComponentParams,
    IFormWrapperCParams,
    IButtonCParams,
    ITimerCParams,
} from 'wlc-engine/modules/core/';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IDeviceRegistrationFormCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    login: string;
    password: string;
    buttonParams?: IButtonCParams;
}

export const timerParams: ITimerCParams = {
    theme: 'one-line',
    themeMod: 'small',
    common: {
        noDays: true,
        noHours: true,
    },
};

export const defaultParams: Partial<IDeviceRegistrationFormCParams> = {
    moduleName: 'user',
    componentName: 'wlc-device-registration-form',
    class: 'wlc-device-registration-form',
    buttonParams: {
        wlcElement: 'button_resend-code',
        common: {
            text: gettext('Send again'),
        },
    },
};

export const deviceRegistrationFormConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'core.wlc-input',
            params: {
                theme: 'vertical',
                wlcElement: 'block_device-registration',
                common: {
                    placeholder: gettext('Code'),
                    autocomplete: 'off',
                },
                name: 'code',
                exampleValue: gettext('Enter the code'),
                validators: [
                    'required',
                ],
                maskOptions: {
                    mask: '000000',
                },
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
};
