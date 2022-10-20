import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export type TAnimationTriggerEvent = 'none' // don't react any trigger
    | 'click' // run animation by click
    | 'hover'; // run animation by hover

export interface ILottieAnimationCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /**
     * Path to the json-animation file
     */
    jsonUrl: string;
    /**
     * Event which activate animation (when autoplay is off)
     */
    animationTriggerEvent?: TAnimationTriggerEvent;
    /**
     * Enables/disables animation loop
     */
    loop: boolean;
    /**
     * Enables/disables animation autoplay
     */
    autoplay?: boolean;
    /**
     * Enables/disables animation loop on hover (uses with animationtriggerEvent: 'hover')
     */
    loopOnHover?: boolean;
    /**
     * Animation speed (from 0 to 1 - slower, more then 1 - faster)
     */
    speed?: number;
};

export const defaultParams: ILottieAnimationCParams = {
    class: 'wlc-lottie-animation',
    componentName: 'wlc-lottie-animation',
    moduleName: 'core',
    jsonUrl: null,
    animationTriggerEvent: 'none',
    autoplay: false,
    loop: false,
    loopOnHover: false,
    speed: 1,
};
