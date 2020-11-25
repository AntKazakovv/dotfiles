import {CustomType, IComponentParams} from 'wlc-engine/classes/abstract.component';
import {IFormWrapperCParams} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IFeedbackFormCParams extends IComponentParams<ComponentTheme, ComponentType, string> {}

export const defaultParams: IFeedbackFormCParams = {
    class: 'wlc-feedback-form',
};

export const feedbackConfig: IFormWrapperCParams = {
    components: [
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: 'Your name',
                },
                name: 'senderName',
                validators: ['required'],
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: 'Email',
                    type: 'email',
                },
                name: 'senderEmail',
                validators: ['required', 'email'],
            },
        },
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: 'Subject',
                },
                name: 'subject',
                validators: ['required'],
            },
        },
        {
            name: 'core.wlc-textarea',
            params: {
                placeholder: 'Message',
                name: 'message',
                validators: ['required'],
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                name: 'submit',
                common: {
                    text: 'Send',
                },
            },
        },
    ],
};
