import {
    IFormWrapperCParams,
    IInputCParams,
    ILinkBlockCParams,
} from 'wlc-engine/modules/core';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

/**
 * @param phone define a user phone number without country code. Pass by inject params from restore-password-form
 * @param resendButton define properties of resend button: `text` - text on button, `Send again` by default
 * @param linkBlockParams define properties of wlc-link-block in footer of the element
 */
export interface IRestoreSmsCodeFormCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    phone?: string;
    resendButton?: {
        text?: string;
    };
    linkBlockParams?: ILinkBlockCParams;
};

export const defaultParams: IRestoreSmsCodeFormCParams = {
    class: 'wlc-restore-sms-code-form',
    componentName: 'wlc-restore-sms-code-form',
    moduleName: 'sms',
    resendButton: {
        text: gettext('Send again'),
    },
    linkBlockParams: {
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
};

export const formConfig: IFormWrapperCParams = {
    components: [
        {
            name: 'core.wlc-input',
            params: <IInputCParams>{
                name: 'code',
                common: {
                    placeholder: gettext('Code'),
                    type: 'text',
                    autocomplete: 'one-time-code',
                },
                exampleValue: gettext('Enter code'),
                validators: [
                    'required',
                ],
                theme: 'vertical',
                wlcElement: 'input_restore-code',
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                common: {
                    text: gettext('Confirm'),
                    type: 'submit',
                    customModifiers: 'centered',
                },
                wlcElement: 'button_submit',
            },
        },
    ],
};
