import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ILottieAnimationCParams} from 'wlc-engine/modules/core/components/lottie-animation/lottie-animation.params';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;
export type AutoModifiers = ComponentTheme | ComponentThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IWaitingResultsCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    animationParams?: ILottieAnimationCParams;
    animation?: {
        use: boolean;
        params: ILottieAnimationCParams;
    }
    imagePath?: string;
}

export const animationParams: ILottieAnimationCParams = {
    jsonUrl: '/gstatic/wlc/prize-wheel/animations/chest.json',
    loop: true,
};

export const defaultParams: IWaitingResultsCParams = {
    moduleName: 'wheel',
    componentName: 'wlc-waiting-results',
    class: 'wlc-waiting-results',
    animation: {
        use: true,
        params: animationParams,
    },
};
