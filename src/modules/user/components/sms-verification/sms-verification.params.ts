import {
    CustomType,
    IComponentParams,
    IFormWrapperCParams,
    ISelectCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ISmsVerificationCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {
        customModifiers?: CustomMod;
        code?: string;
    };
    modifiers?: Modifiers[];
    formConfig?: IFormWrapperCParams;
    codeConfig?: IFormWrapperCParams;
}

export const defaultParams: ISmsVerificationCParams = {
    class: 'wlc-sms-verification',
    wlcElement: 'modal_signup_sms_verification',
    componentName: 'wlc-sms-verification',
    moduleName: 'user',
};

export const smsVerificationFormConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'user.wlc-phone-field',
            params: {
                name: ['phoneCode', 'phoneNumber'],
                locked: true,
                phoneCode: <ISelectCParams>{
                    labelText: gettext('Mobile code'),
                    wlcElement: 'block_phoneCode',
                    common: {
                        placeholder: gettext('Mobile code'),
                    },
                    locked: true,
                    name: 'phoneCode',
                    validators: ['required'],
                    options: 'phoneCodes',
                },
                phoneNumber: {
                    common: {
                        separateLabel: gettext('Mobile phone'),
                        placeholder: gettext('Enter phone number'),
                        type: 'text',
                    },
                    wlcElement: 'block_phoneNumber',
                    name: 'phoneNumber',
                    locked: true,
                    validators: [
                        'required',
                    ],
                    maskOptions: {
                        mask: new RegExp(/^\d{0,13}$/),
                    },
                },
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                common: {
                    text: gettext('Get code'),
                    type: 'submit',
                    customModifiers: 'centered',
                },
                wlcElement: 'button_submit',
            },
        },
    ],
};

export const smsVerificationFormCodeConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'core.wlc-input',
            params: {
                theme: 'vertical',
                common: {
                    separateLabel: gettext('Code'),
                    placeholder: gettext('Enter code'),
                    type: 'number',
                },
                wlcElement: 'block_sms-code',
                name: 'code',
                locked: true,
                validators: ['required',
                    {
                        name: 'minLength',
                        options: 4,
                    },
                    {
                        name: 'maxLength',
                        options: 6,
                    },
                ],
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
