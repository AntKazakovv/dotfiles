import {
    IFormWrapperCParams,
    IInputCParams,
    ITextBlockCParams,
} from 'wlc-engine/modules/core';
import {IAlertCParams} from 'wlc-engine/modules/core/components/alert/alert.params';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITransferCParams extends IComponentParams<Theme, Type, ThemeMod> {
}

export const defaultParams: ITransferCParams = {
    moduleName: 'transfer',
    componentName: 'wlc-transfer',
    class: 'wlc-transfer',
};

export const infoBlock: IFormComponent = {
    name: 'core.wlc-alert',
    params: <IAlertCParams>{},
};

export const amountTitle: IFormComponent = {
    name: 'core.wlc-text-block',
    params: <ITextBlockCParams>{
        common: {
            textBlockSubtitle: ['2.', gettext('Amount')],
        },
    },
};

export const transferDivider: IFormComponent = {
    name: 'core.wlc-wrapper',
    params: {
        class: 'wlc-divider',
        components: [],
    },
};

export const transferRadioBtns: IFormComponent[] = [
    {
        name: 'core.wlc-text-block',
        params: <ITextBlockCParams>{
            common: {
                textBlockText: gettext('Please select the preferred option:'),
            },
        },
    },
    {
        name: 'core.wlc-radio-buttons',
        params: {
            name: 'type',
            theme: 'default',
            defaultValue: 0,
            common: {
                placeholder: gettext(''),
            },
            items: [
                {
                    value: 'email',
                    title: gettext('E-mail'),
                    disabled: false,
                },
                {
                    value: 'sms',
                    title: gettext('Phone number'),
                    disabled: false,
                },
            ],
        },
    },
];

export const transferButton: IFormComponent = {
    name: 'core.wlc-button',
    params: {
        common: {
            text: gettext('Get code'),
            type: 'submit',
        },
        wlcElement: 'button_submit',
    },
};

export const submitButton: IFormComponent = {
    name: 'core.wlc-button',
    params: {
        common: {
            text: gettext('Confirm'),
            type: 'submit',
            customModifiers: 'centered',
        },
        wlcElement: 'button_submit',
    },
};

export const transferFormConfigTop: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        infoBlock,
    ],
};

export const transferFormCodeConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'core.wlc-input',
            params: <IInputCParams>{
                theme: 'vertical',
                common: {
                    placeholder: gettext('Code'),
                    type: 'number',
                },
                locked: true,
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
                wlcElement: 'block_transfer-code',
            },
        },
        submitButton,
    ],
};
