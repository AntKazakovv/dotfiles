import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

import {IFormWrapperCParams} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {PepStatusValuableOnly} from 'wlc-engine/modules/core/system/interfaces/user.interface';
import {IWrapperCParams} from 'wlc-engine/modules/core/components/wrapper/wrapper.component';
import {ITextBlockCParams} from 'wlc-engine/modules/core/components/text-block/text-block.params';
import {IIconCParams} from 'wlc-engine/modules/core/components/icon/icon.params';
import {ICheckboxCParams} from 'wlc-engine/modules/core/components/checkbox/checkbox.params';
import {IButtonCParams} from 'wlc-engine/modules/core/components/button/button.component';
import {phrases as pepPhrases} from 'wlc-engine/modules/user/system/services/pep/pep.translations';

type ComponentTheme = 'default' | CustomType;

type ComponentType = 'default' | CustomType;

type Theme = 'default' | CustomType;

type AutoModifiers = Theme | 'default';

type CustomMod = string;

type Modifiers = AutoModifiers | CustomMod | null;

export interface IPepInfoCParams extends IComponentParams<ComponentTheme, ComponentType, Modifiers> {
    pep: PepStatusValuableOnly;
    config?: IFormWrapperCParams;
}

export const defaultParams: Partial<IPepInfoCParams> = {
    class: 'wlc-pep-info',
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
                                common: {
                                    wlcElement: 'button_submit',
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
