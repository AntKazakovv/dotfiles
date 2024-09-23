import {
    CustomType,
    IButtonCParams,
    IComponentParams,
    IFormWrapperCParams,
    ISelectCParams,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {ProhibitedPatterns} from 'wlc-engine/modules/core/constants';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'inline' | CustomType;
export type AutoModifiers = 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ISmsVerificationCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    common?: {
        customModifiers?: CustomMod;
        code?: string;
    };
    alertText?: string;
    description?: string;
    modifiers?: Modifiers[];
    formConfig?: IFormWrapperCParams;
    codeConfig?: IFormWrapperCParams;
    resendButton?: IButtonCParams,
    functional: 'registration' | 'profile';
    showDividers?: boolean;
}

export const defaultParams: ISmsVerificationCParams = {
    class: 'wlc-sms-verification',
    wlcElement: 'modal_signup_sms_verification',
    componentName: 'wlc-sms-verification',
    moduleName: 'sms',
    functional: 'registration',
    resendButton: {
        common: {
            text: gettext('Send again'),
        },
    },
    showDividers: false,
};

export const smsVerificationFormConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'forms.wlc-phone-field',
            params: {
                name: ['phoneCode', 'phoneNumber'],
                phoneCode: <ISelectCParams>{
                    labelText: gettext('Mobile code'),
                    wlcElement: 'block_phoneCode',
                    common: {
                        placeholder: gettext('Mobile code'),
                        type: 'tel',
                    },
                    name: 'phoneCode',
                    validators: ['required'],
                    options: 'phoneCodes',
                },
                phoneNumber: {
                    common: {
                        separateLabel: gettext('Mobile phone'),
                        placeholder: gettext('Enter phone number'),
                        type: 'tel',
                    },
                    wlcElement: 'block_phoneNumber',
                    name: 'phoneNumber',
                    validators: [
                        'required',
                    ],
                    prohibitedPattern: ProhibitedPatterns.notNumberSymbols,
                },
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                common: {
                    text: gettext('Get code'),
                    type: 'submit',
                    typeAttr: 'submit',
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
                    typeAttr: 'submit',
                    customModifiers: 'centered',
                },
                wlcElement: 'button_submit',
            },
        },
    ],
};

const description: string
    = gettext('You can send a request 1 time in 2 minutes. The maximum amount of requests per 24 hours is 3');
const alertText: string = gettext('To display all available payment systems, confirm your phone number');

export const inlinePhoneVerificationConfig: IWrapperCParams = {
    components: [
        {
            name: 'sms.wlc-sms-verification',
            params: {
                themeMod: 'inline',
                functional: 'profile',
                showDividers: true,
                alertText,
                description,
                formConfig: {
                    class: 'wlc-form-wrapper',
                    components: [
                        {
                            name: 'user.wlc-phone-field',
                            params: {
                                name: ['phoneCode', 'phoneNumber'],
                                phoneCode: {
                                    labelText: gettext('Phone'),
                                    wlcElement: 'block_phoneCode',
                                    type: 'tel',
                                    common: {
                                        placeholder: gettext('Mobile code'),
                                    },
                                    name: 'phoneCode',
                                    validators: ['required'],
                                    options: 'phoneCodes',
                                },
                                phoneNumber: {
                                    common: {
                                        useLabel: false,
                                        separateLabel: '',
                                        placeholder: gettext('Enter phone number'),
                                        type: 'tel',
                                    },
                                    wlcElement: 'block_phoneNumber',
                                    name: 'phoneNumber',
                                    validators: [
                                        'required',
                                    ],
                                    prohibitedPattern: ProhibitedPatterns.notNumberSymbols,
                                },
                            },
                        },
                        {
                            name: 'core.wlc-button',
                            params: {
                                common: {
                                    text: gettext('Verify'),
                                    type: 'submit',
                                    typeAttr: 'submit',
                                    customModifiers: 'centered',
                                },
                                wlcElement: 'button_submit',
                            },
                        },
                    ],
                },
            },
        },
    ],
};
