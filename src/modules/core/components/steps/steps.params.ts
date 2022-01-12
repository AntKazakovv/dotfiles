import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    IIndexing,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {Type} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.params';
import {ChosenBonusSetParams} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses.interface';
import {IBonusesListCParams} from 'wlc-engine/modules/bonuses/components';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | 'signInUp' | CustomType;
export type ThemeMod = 'default' | 'first' | 'skip-bonus' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IStep {
    name: string,
    config: IStepConfig,
}

export interface IStepConfig extends IWrapperCParams {
    name: string;
}

export enum StepsEvents {
    Next = 'NEXT_REG_STEP',
    Prev = 'PREVIOUS_REG_STEP',
}

export interface IStepsParams extends IComponentParams<Theme, Type, ThemeMod> {
    theme?: Theme,
    themeMod?: ThemeMod,
    stepsNames: string[],
    stepsConfig?: IIndexing<IStepConfig>,
    startStepName: string,
    stepsConfigFirst?: IIndexing<IStepConfig>,
    stepsConfigWithoutBonus?: IIndexing<IStepConfig>,
}

const textBlockHeaderParams = {
    textBlockTitle: gettext('Register'),
    titleDynamicText: {
        textDefault: '',
        param: 'regStepsCounter',
    },
};

const textBlockHeaderBonus = {
    name: 'core.wlc-text-block',
    params: {
        common: {
            ...textBlockHeaderParams,
            textBlockSubtitle: gettext('Choose your Welcome Bonus'),
        },
    },
};

const textBlockHeaderReg = {
    name: 'core.wlc-text-block',
    params: {
        common: {
            ...textBlockHeaderParams,
            textBlockSubtitle: gettext('Your adventure begins'),
        },
    },
};

const textBlockHeaderSms = {
    name: 'core.wlc-text-block',
    params: {
        common: {
            ...textBlockHeaderParams,
            textBlockSubtitle: gettext('Verify your account'),
        },
    },
};

const bonusesSwiperParams = {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: false,
    navigation: {
        nextEl: '.wlc-bonuses-list .wlc-swiper-button-next',
        prevEl: '.wlc-bonuses-list .wlc-swiper-button-prev',
    },
    pagination: false,
};

const bonusesStepButton = {
    name: 'core.wlc-button',
    params: {
        wlcElement: 'button_next',
        common: {
            customModifiers: 'next-step',
            text: gettext('Next'),
            event: {
                name: StepsEvents.Next,
            },
        },
    },
};

const linkBlock = {
    name: 'core.wlc-link-block',
    params: {
        wlcElement: 'login',
        common: {
            subtitle: gettext('Already have an account?'),
            link: gettext('Login now'),
            actionParams: {
                modal: {
                    name: 'login',
                },
            },
        },
    },
};

const backLinkBlock = {
    name: 'core.wlc-link-block',
    params: {
        wlcElement: 'back',
        common: {
            link: gettext('Back'),
            actionParams: {
                event: {
                    name: StepsEvents.Prev,
                },
            },
        },
    },
};

const regFormStepTopComponents = {
    name: 'core.wlc-wrapper',
    params: {
        class: 'wlc-steps__head',
        components: [
            backLinkBlock,
            textBlockHeaderReg,
            {
                name: 'core.wlc-text-block',
                params: {
                    common: {
                        dynamicText: {
                            text: gettext('The chosen bonus:'),
                            textDefault: gettext('Without Bonus'),
                            param: ChosenBonusSetParams.ChosenBonus + '.name',
                        },
                    },
                },
            },
        ],
    },
};

const getMagLicenseForm = (isSecondProfile: boolean) => {
    const form: IStepConfig = {
        name: 'core.wlc-wrapper',
        class: 'wlc-steps__container wlc-steps__container--sign-up',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-steps__main',
                    components: [
                        regFormStepTopComponents,
                        {
                            name: 'user.wlc-sign-up-form',
                            params: {
                                customMod: ['mga'],
                                formType: 'mga',
                            },
                        },
                    ],
                },
            },
        ],
    };
    if (isSecondProfile) {
        form.components.push(bonusPrewiew);
    }
    return form;
};

const regFormComponent = {
    name: 'user.wlc-sign-up-form',
};

const bonusPrewiew = {
    name: 'core.wlc-wrapper',
    params: {
        class: 'wlc-steps__aside',
        components: [
            {
                name: 'bonuses.wlc-bonus-item',
                params: {
                    theme: 'preview',
                    common: {},
                },
                display: {
                    after: 899,
                },
            },
        ],
    },
};

const smsVerification = {
    name: 'core.wlc-wrapper',
    params: {
        class: 'wlc-steps__main',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-steps__head',
                    components: [
                        backLinkBlock,
                        textBlockHeaderSms,
                    ],
                },
            },
            {
                name: 'user.wlc-sms-verification',
            },
            linkBlock,
        ],
    },
};

export const defaultParams: IStepsParams = {
    moduleName: 'core',
    componentName: 'wlc-steps',
    class: 'wlc-steps',
    theme: 'signInUp',
    stepsNames: ['signUpBonuses', 'signUpForm'],
    startStepName: 'signUpBonuses',
    stepsConfig: {
        'signUpBonuses': {
            name: 'core.wlc-wrapper',
            class: 'wlc-steps__container',
            components: [
                {
                    name: 'core.wlc-wrapper',
                    params: {
                        class: 'wlc-steps__main',
                        components: [
                            textBlockHeaderBonus,
                            {
                                name: 'bonuses.wlc-bonuses-list',
                                display: {
                                    before: 899,
                                },
                                params: <IBonusesListCParams>{
                                    wlcElement: 'block_bonuses',
                                    type: 'swiper',
                                    theme: 'partial',
                                    common: {
                                        restType: 'any',
                                        filter: 'reg',
                                        selectFirstBonus: true,
                                        useBlankBonus: true,
                                        swiper: bonusesSwiperParams,
                                    },
                                    useBtnNoBonuses: false,
                                },
                            },
                            {
                                name: 'bonuses.wlc-bonuses-list',
                                display: {
                                    after: 900,
                                },
                                params: <IBonusesListCParams>{
                                    wlcElement: 'block_bonuses',
                                    theme: 'partial',
                                    common: {
                                        restType: 'any',
                                        filter: 'reg',
                                        selectFirstBonus: true,
                                        useBlankBonus: true,
                                    },
                                    useBtnNoBonuses: false,
                                },
                            },
                            bonusesStepButton,
                            linkBlock,
                        ],
                    },
                },
                bonusPrewiew,
            ],
        },
        'signUpForm': {
            name: 'core.wlc-wrapper',
            class: 'wlc-steps__container wlc-steps__container--sign-up',
            components: [
                {
                    name: 'core.wlc-wrapper',
                    params: {
                        class: 'wlc-steps__main',
                        components: [
                            regFormStepTopComponents,
                            regFormComponent,
                        ],
                    },
                },
                bonusPrewiew,
            ],
        },
        'signUpFormMagLicense': getMagLicenseForm(true),
        'signUpSmsVerify': {
            name: 'core.wlc-wrapper',
            class: 'wlc-steps__container wlc-steps__container--sign-up',
            components: [
                smsVerification,
                bonusPrewiew,
            ],
        },
    },
    stepsConfigFirst: {
        'signUpBonuses': {
            name: 'core.wlc-wrapper',
            class: 'wlc-steps__container',
            components: [
                {
                    name: 'core.wlc-wrapper',
                    params: {
                        class: 'wlc-steps__main',
                        components: [
                            textBlockHeaderBonus,
                            {
                                name: 'bonuses.wlc-bonuses-list',
                                params: <IBonusesListCParams>{
                                    wlcElement: 'block_bonuses',
                                    type: 'swiper',
                                    theme: 'reg-first',
                                    common: {
                                        restType: 'any',
                                        filter: 'reg',
                                        selectFirstBonus: true,
                                        useBlankBonus: false,
                                        swiper: bonusesSwiperParams,
                                    },
                                    itemsParams: {
                                        common: {
                                            type: 'reg',
                                        },
                                    },
                                    useBtnNoBonuses: false,
                                },
                            },
                            bonusesStepButton,
                            linkBlock,
                        ],
                    },
                },
            ],
        },
        'signUpForm': {
            name: 'core.wlc-wrapper',
            class: 'wlc-steps__container wlc-steps__container--sign-up',
            components: [
                {
                    name: 'core.wlc-wrapper',
                    params: {
                        class: 'wlc-steps__main',
                        components: [
                            regFormStepTopComponents,
                            regFormComponent,
                        ],
                    },
                },
            ],
        },
        'signUpFormMagLicense': getMagLicenseForm(false),
        'signUpSmsVerify': {
            name: 'core.wlc-wrapper',
            class: 'wlc-steps__container wlc-steps__container--sign-up',
            components: [
                smsVerification,
            ],
        },
    },
    stepsConfigWithoutBonus: {
        'signUpForm': {
            name: 'core.wlc-wrapper',
            class: 'wlc-steps__container wlc-steps__container--sign-up',
            components: [
                {
                    name: 'core.wlc-wrapper',
                    params: {
                        class: 'wlc-steps__main',
                        components: [
                            {
                                name: 'core.wlc-wrapper',
                                params: {
                                    class: 'wlc-steps__head',
                                    components: [
                                        textBlockHeaderReg,
                                    ],
                                },
                            },
                            regFormComponent,
                        ],
                    },
                },
            ],
        },
        'signUpFormMagLicense': getMagLicenseForm(false),
        'signUpSmsVerify': {
            name: 'core.wlc-wrapper',
            class: 'wlc-steps__container wlc-steps__container--sign-up',
            components: [
                smsVerification,
            ],
        },
    },
};
