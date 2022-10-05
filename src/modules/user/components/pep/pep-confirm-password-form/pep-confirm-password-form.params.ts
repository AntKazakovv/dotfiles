import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IFormWrapperCParams} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {
    IButtonCParams,
    ITextBlockCParams,
    IWrapperCParams,
    PepStatusValuableOnly,
} from 'wlc-engine/modules/core';

import {phrases as pepPhrases} from 'wlc-engine/modules/user/system/services/pep/pep.translations';

type ComponentTheme = 'default' | CustomType;

type ComponentType = 'default' | CustomType;

type Theme = 'default' | CustomType;

type AutoModifiers = Theme | 'default';

type CustomMod = string;

type Modifiers = AutoModifiers | CustomMod | null;

export interface IPepConfirmPasswordFormCParams extends IComponentParams<ComponentTheme, ComponentType, Modifiers> {
    pep: PepStatusValuableOnly;
    config?: IFormWrapperCParams;
}

export const defaultParams: Partial<IPepConfirmPasswordFormCParams> = {
    class: 'wlc-pep-confirm-password-form',
    config: {
        components: [
            {
                name: 'core.wlc-wrapper',
                params: <IWrapperCParams>{
                    class: 'wlc-pep-confirm-password-form__message',
                    components: [
                        {
                            name: 'core.wlc-text-block',
                            params: <ITextBlockCParams>{
                                common: {
                                    textBlockText: pepPhrases.modals.confirmation.message,
                                },
                            },
                        },
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: <IWrapperCParams>{
                    class: 'wlc-pep-confirm-password-form__controls',
                    components: [
                        {
                            name: 'core.wlc-input',
                            params: {
                                wlcElement: 'block_password-confirm',
                                common: {
                                    placeholder: pepPhrases.modals.confirmation.password,
                                    type: 'password',
                                    customModifiers: 'right-shift',
                                    usePasswordVisibilityBtn: true,
                                },
                                name: 'password',
                                validators: [
                                    'required',
                                    {
                                        name: 'minLength',
                                        options: 6,
                                    },
                                    {
                                        name: 'maxLength',
                                        options: 50,
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: <IWrapperCParams>{
                    class: 'wlc-pep-confirm-password-form__actions',
                    components: [
                        {
                            name: 'core.wlc-button',
                            params: <IButtonCParams>{
                                wlcElement: 'button_submit',
                                common: {
                                    text: pepPhrases.modals.confirmation.confirm,
                                    type: 'submit',
                                },
                            },
                        },
                    ],
                },
            },
        ],
    },
};
