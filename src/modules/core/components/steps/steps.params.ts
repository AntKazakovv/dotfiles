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

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | 'signInUp' | CustomType;
export type ThemeMod = 'default' | 'first' | CustomType;
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
    stepsConfig?: IIndexing<IStepConfig>,
    startStepName: string,
    stepsConfigFirst?: IIndexing<IStepConfig>,
}

const textBlockHeader = {
    name: 'core.wlc-text-block',
    params: {
        common: {
            textBlockTitle: gettext('Register 1/2'),
            textBlockSubtitle: gettext('Choose your Welcome Bonus'),
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

const regFormStepTopComponents = {
    name: 'core.wlc-wrapper',
    params: {
        class: 'wlc-steps__head',
        components: [
            {
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
            },
            {
                name: 'core.wlc-text-block',
                params: {
                    common: {
                        textBlockTitle: gettext('Register 2/2'),
                        textBlockSubtitle: gettext('Your adventure begins'),
                    },
                },
            },
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

const regFormComponent = {
    name: 'user.wlc-sign-up-form',
};

export const defaultParams: IStepsParams = {
    moduleName: 'core',
    componentName: 'wlc-steps',
    class: 'wlc-steps',
    theme: 'signInUp',
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
                            textBlockHeader,
                            {
                                name: 'bonuses.wlc-bonuses-list',
                                display: {
                                    before: 899,
                                },
                                params: {
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
                                },
                            },
                            {
                                name: 'bonuses.wlc-bonuses-list',
                                display: {
                                    after: 900,
                                },
                                params: {
                                    wlcElement: 'block_bonuses',
                                    theme: 'partial',
                                    common: {
                                        restType: 'any',
                                        filter: 'reg',
                                        selectFirstBonus: true,
                                        useBlankBonus: true,
                                    },
                                },
                            },
                            bonusesStepButton,
                            linkBlock,
                        ],
                    },
                },
                {
                    name: 'core.wlc-wrapper',
                    params: {
                        class: 'wlc-steps__aside',
                        components: [
                            {
                                params: {
                                    theme: 'preview',
                                    common: {},
                                },
                                name: 'bonuses.wlc-bonus-item',
                                display: {
                                    after: 899,
                                },
                            },
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
                {
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
                },
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
                            textBlockHeader,
                            {
                                name: 'bonuses.wlc-bonuses-list',
                                params: {
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
    },
};
