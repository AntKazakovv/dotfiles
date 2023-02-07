import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IFormWrapperCParams} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {ProhibitedPatterns} from 'wlc-engine/modules/core/constants';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IFeedbackFormCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    formConfig?: IFormWrapperCParams;
}

export const getFeedbackConfig = (isAuth: boolean): IFormWrapperCParams => ({
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'core.wlc-input',
            params: {
                locked: isAuth,
                common: {
                    placeholder: gettext('Your name'),
                },
                theme: 'vertical',
                wlcElement: 'block_sender-name',
                name: 'senderName',
                prohibitedPattern: ProhibitedPatterns.notNamesSymbols,
                validators: [
                    'required',
                    'allowLettersOnly',
                    {
                        name: 'minLength',
                        text: gettext('Field length must be more than 2 characters'),
                        options: 2,
                    },
                    {
                        name: 'maxLength',
                        text: gettext('The field must be no more than 50 characters long'),
                        options: 50,
                    },
                ],
                exampleValue: gettext('Enter your name'),
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                locked: isAuth,
                common: {
                    placeholder: gettext('E-mail'),
                    type: 'email',
                },
                name: 'senderEmail',
                theme: 'vertical',
                wlcElement: 'block_email',
                validators: [
                    'required',
                    'email',
                    {
                        name: 'maxLength',
                        text: gettext('The field must be no more than 50 characters long'),
                        options: 50,
                    },
                ],
                exampleValue: 'example@mail.com',
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: gettext('Subject'),
                },
                name: 'subject',
                theme: 'vertical',
                wlcElement: 'block_subject',
                validators: [
                    'required',
                    {
                        name: 'maxLength',
                        text: gettext('The field must be no more than 50 characters long'),
                        options: 50,
                    },
                ],
                exampleValue: 'Enter subject',
            },
        },
        {
            name: 'core.wlc-textarea',
            params: {
                common: {
                    placeholder: gettext('Message'),
                },
                name: 'message',
                wlcElement: 'block_message',
                themeMod: 'feedback-form',
                validators: [
                    'required',
                    {
                        name: 'minLength',
                        text: gettext('Field length must be more than 5 characters'),
                        options: 5,
                    },
                    {
                        name: 'maxLength',
                        text: gettext('The field must be no more than 1500 characters long'),
                        options: 1500,
                    },
                    {
                        name: 'regExp',
                        text: gettext('Such constructions are prohibited'),
                        options: /<\/?\w+>/gi,
                    },
                ],
                exampleValue: gettext('Enter your message'),
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                wlcElement: 'button_submit',
                common: {
                    typeAttr: 'submit',
                    text: gettext('Send message'),
                },
            },
        },
    ],
});

export const defaultParams: IFeedbackFormCParams = {
    moduleName: 'core',
    componentName: 'wlc-feedback-form',
    class: 'wlc-feedback-form',
};
