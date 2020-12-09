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
                theme: 'placeholder-shown',
                common: {
                    placeholder: gettext('Your name *'),
                },
                name: 'senderName',
                validators: ['required'],
                exampleValue: 'Example: Ivan',
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                theme: 'placeholder-shown',
                common: {
                    placeholder: gettext('Email *'),
                    type: 'email',
                },
                name: 'senderEmail',
                validators: ['required', 'email'],
                exampleValue: 'example@mail.com',
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                theme: 'placeholder-shown',
                common: {
                    placeholder: gettext('Subject *'),
                },
                name: 'subject',
                validators: ['required'],
            },
        },
        {
            name: 'core.wlc-textarea',
            params: {
                theme: 'placeholder-shown',
                common: {
                    placeholder: gettext('Message *'),
                },
                name: 'message',
                validators: ['required'],
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                name: 'submit',
                common: {
                    text: gettext('Send'),
                },
            },
        },
    ],
};
