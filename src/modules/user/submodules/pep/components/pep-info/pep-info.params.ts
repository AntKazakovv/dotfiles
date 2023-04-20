import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

import {
    IFormWrapperCParams,
    IWrapperCParams,
    ITextBlockCParams,
    IIconCParams,
    ICheckboxCParams,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {phrases as pepPhrases} from 'wlc-engine/modules/user/submodules/pep/system/services/pep/pep.translations';

type ComponentTheme = 'default' | CustomType;

type ComponentType = 'default' | CustomType;

type Theme = 'default' | CustomType;

type AutoModifiers = Theme | 'default';

type CustomMod = string;

type Modifiers = AutoModifiers | CustomMod | null;

export interface IPepInfoCParams extends IComponentParams<ComponentTheme, ComponentType, Modifiers> {
    pep: boolean;
    config?: IFormWrapperCParams;
}

export const defaultParams: Partial<IPepInfoCParams> = {
    class: 'wlc-pep-info',
    moduleName: 'pep',
    config: {
        class: 'wlc-form-wrapper',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: <IWrapperCParams>{
                    class: 'wlc-pep-info__article',
                    components: [
                        {
                            name: 'core.wlc-text-block',
                            params: <ITextBlockCParams>{
                                class: 'wlc-pep-info__text wlc-pep-info__text--highlighted',
                                common: {
                                    textBlockText: pepPhrases.modals.info.term,
                                },
                            },
                        },
                        {
                            name: 'core.wlc-text-block',
                            params: <ITextBlockCParams>{
                                class: 'wlc-pep-info__text',
                                common: {
                                    textBlockText: pepPhrases.modals.info.explaining,
                                },
                            },
                        },
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: <IWrapperCParams>{
                    class: 'wlc-pep-info__divider',
                    components: [],
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: <IWrapperCParams>{
                    class: 'wlc-pep-info__info-icon',
                    components: [
                        {
                            name: 'core.wlc-icon',
                            params: <IIconCParams>{
                                showSvgAsImg: true,
                                iconPath: '/wlc/icons/info-2.svg',
                            },
                        },
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: <IWrapperCParams>{
                    class: 'wlc-pep-info__article',
                    components: [
                        {
                            name: 'core.wlc-text-block',
                            params: <ITextBlockCParams>{
                                class: 'wlc-pep-info__text wlc-pep-info__text--highlighted',
                                common: {
                                    textBlockText: pepPhrases.modals.info.pleaseNote,
                                },
                            },
                        },
                        {
                            name: 'core.wlc-text-block',
                            params: <ITextBlockCParams>{
                                class: 'wlc-pep-info__text',
                                common: {
                                    textBlockText: pepPhrases.modals.info.notice,
                                },
                            },
                        },
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: <IWrapperCParams>{
                    class: 'wlc-pep-info__controls',
                    components: [
                        {
                            name: 'core.wlc-checkbox',
                            params: <ICheckboxCParams>{
                                name: 'confirmed',
                                text: pepPhrases.modals.info.confirm,
                                validators: ['requiredTrue'],
                            },
                        },
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: <IWrapperCParams>{
                    class: 'wlc-pep-info__actions',
                    components: [
                        {
                            name: 'core.wlc-button',
                            params: <IButtonCParams>{
                                name: 'close',
                                themeMod: 'secondary',
                                wlcElement: 'wlc-btn_close',
                                common: {
                                    event: {name: 'PEP_STATUS_CANCEL'},
                                    typeAttr: 'button',
                                    text: pepPhrases.modals.info.close,
                                },
                            },
                        },
                        {
                            name: 'core.wlc-button',
                            params: <IButtonCParams>{
                                name: 'submit',
                                wlcElement: 'wlc-btn_next',
                                common: {
                                    typeAttr: 'submit',
                                    text: pepPhrases.modals.info.next,
                                },
                            },
                        },
                    ],
                },
            },
        ],
    },
};
