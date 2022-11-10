import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    IIndexing,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {
    ChosenBonusSetParams,
    IBonusesListCParams,
} from 'wlc-engine/modules/bonuses';

export type Type = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | 'signInUp' | CustomType;
export type ThemeMod = 'default' | 'first' | 'skip-bonus' | 'with-promo' | CustomType;
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
    textBlockTitle: gettext('Sign up'),
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

export const regFormStepTopComponents = {
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

const getTwoStepsForm = (isSecondProfile: boolean) => {
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
                                customMod: ['secondStep'],
                                formType: 'secondStep',
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

const regBanner = {
    name: 'promo.wlc-banner',
    params: {
        filter: {
            position: ['reg-banner'],
        },
    },
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
                                    themeMod: 'with-image',
                                    common: {
                                        restType: 'any',
                                        filter: 'reg',
                                        selectFirstBonus: true,
                                        useBlankBonus: true,
                                        swiper: bonusesSwiperParams,
                                    },
                                    itemsParams: {
                                        modifiers: ['mobile-reg'],
                                    },
                                    btnNoBonuses: {
                                        use: false,
                                    },
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
                                    btnNoBonuses: {
                                        use: false,
                                    },
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
        'signUpFormTwoSteps': getTwoStepsForm(true),
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
                                            nameClamp: 2,
                                        },
                                    },
                                    btnNoBonuses: {
                                        use: false,
                                    },
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
        'signUpFormTwoSteps': getTwoStepsForm(false),
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
        'signUpFormTwoSteps': getTwoStepsForm(false),
        'signUpSmsVerify': {
            name: 'core.wlc-wrapper',
            class: 'wlc-steps__container wlc-steps__container--sign-up',
            components: [
                smsVerification,
            ],
        },

        'signUpWithPromoBanner': {
            name: 'core.wlc-wrapper',
            class: 'wlc-steps__container wlc-steps__container--sign-up',
            components: [
                regBanner,
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
    },
};
