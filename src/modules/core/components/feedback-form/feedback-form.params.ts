import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IFormWrapperCParams} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IFeedbackFormCParams extends IComponentParams<ComponentTheme, ComponentType, string> {}

export const defaultParams: IFeedbackFormCParams = {
    class: 'wlc-feedback-form',
};

export const feedbackConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: gettext('Your name'),
                },
                theme: 'vertical',
                wlcElement: 'block_sender-name',
                name: 'senderName',
                validators: [
                    'required',
                    {
                        name: 'minLength',
                        text: 'Field length must be more than 2 characters',
                        options: 2,
                    },
                    {
                        name: 'maxLength',
                        text: 'The field must be no more than 50 characters long',
                        options: 50,
                    },
                    {
                        name: 'regExp',
                        text: 'Enter a valid username',
                        options: /[@#$%&<>^*'"\/\\\/!№()\d]+/,
                    },
                ],
                exampleValue: 'Enter your name',
            },
        },
        {
            name: 'core.wlc-input',
            params: {
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
                        text: 'The field must be no more than 50 characters long',
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
                        text: 'The field must be no more than 50 characters long',
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

                validators: [
                    'required',
                    {
                        name: 'minLength',
                        text: 'Field length must be more than 5 characters',
                        options: 5,
                    },
                    {
                        name: 'maxLength',
                        text: 'The field must be no more than 1500 characters long',
                        options: 1500,
                    },
                    {
                        name: 'regExp',
                        text: 'Such constructions are prohibited',
                        options: /<\/?\w+>/gi,
                    },
                ],
                exampleValue: 'Enter your message',
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                name: 'submit',
                wlcElement: 'button_submit',
                common: {
                    text: gettext('Send message'),
                },
            },
        },
    ],
};
