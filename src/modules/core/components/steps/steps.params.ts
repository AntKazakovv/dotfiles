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
export type ThemeMod = 'default' | CustomType;
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
    stepsConfig: IIndexing<IStepConfig>,
    startStepName: string,
}

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
                            {
                                name: 'core.wlc-text-block',
                                params: {
                                    common: {
                                        textBlockTitle: gettext('Register 1/2'),
                                        textBlockSubtitle: gettext('Choose your Welcome Bonus'),
                                    },
                                },
                            },
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
                                        swiper: {
                                            slidesPerView: 1,
                                            spaceBetween: 10,
                                            loop: false,
                                            navigation: true,
                                        },
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
                            {
                                name: 'core.wlc-button',
                                params: {
                                    common: {
                                        customModifiers: 'next-step',
                                        text: gettext('Next'),
                                        event: {
                                            name: StepsEvents.Next,
                                        },
                                    },
                                },
                            },
                            {
                                name: 'core.wlc-link-block',
                                params: {
                                    common: {
                                        subtitle: gettext('Already have an account?'),
                                        link: gettext('Sign in now'),
                                        actionParams: {
                                            modal: {
                                                name: 'login',
                                            },
                                        },
                                    },
                                },
                            },
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
                            {
                                name: 'core.wlc-wrapper',
                                params: {
                                    class: 'wlc-steps__head',
                                    components: [
                                        {
                                            name: 'core.wlc-link-block',
                                            params: {
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
                            },
                            {
                                name: 'user.wlc-sign-up-form',
                            },
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
};
