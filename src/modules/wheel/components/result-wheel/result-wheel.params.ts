import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ILottieAnimationCParams} from 'wlc-engine/modules/core/components/lottie-animation/lottie-animation.params';
import {ParticipantModel} from 'wlc-engine/modules/wheel/system/models';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;
export type AutoModifiers = ComponentTheme | ComponentThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IResultWheelCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    pathIllustration?: string;
    animation?: {
        use: boolean;
        params: ILottieAnimationCParams;
    }
    itsYou?: boolean;
    amountPrize?: number;
    winners?: ParticipantModel[];
    currency?: string;
    isStreamer?: boolean;
}

export const animationParams: ILottieAnimationCParams = {
    jsonUrl: '/gstatic/wlc/wheel/animations/confetti.json',
    loop: true,
};

export const defaultParams: IResultWheelCParams = {
    moduleName: 'wheel',
    componentName: 'wlc-result-wheel',
    class: 'wlc-result-wheel',
    pathIllustration: '/wlc/prize-wheel/cup_rabbit.png',
    itsYou: false,
    isStreamer: false,
    animation: {
        use: true,
        params: animationParams,
    },
};
