import {IComponentParams} from 'wlc-engine/modules/core';

export type ComponentType = string;
export type ComponentTheme = string;
export type ComponentThemeMod = string;

export interface ISizes {
    width: number;
    height: number;
}

export interface IAnimateSpriteCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /**
     * @param string
     * @description sprite url
     */
    imageUrl: string;
    /**
     * @param number
     * @description sprite frames count
     */
    framesCount?: number;
    /**
     * @param boolean
     * @description if true animation will play infinite until mouse leave event target
    */
    animateUntilMouseLeave?: boolean;
    /**
     * @param boolean
     * @description use host element to animate sprite
     */
    useEventsOnCanvas?: boolean;
    /**
     * @param number
     * @description interval between frames changing
     */
    interval?: number;
    /**
     * @param boolean
     * @description if false, animation will stop in current position and then starts from this one
     */
    fullAnimatingCycle?: boolean;
    /**
     * @params number
     * @description how many cycles to play the animation before pausing. does't work with falsy {fullAnimatingCycle}
     */
    animationCycleCount?: number;
    /**
     * @description auto animation settings
     */
    autoAnimating?: {
        /**
         * @param boolean
         * @description use auto animation on timeout
         */
        use: boolean;
        /**
         * @param number
         * @description minimum interval between animation cycles
         */
        intervalFrom?: number;
        /**
         * @param number
         * @description maximum interval between animation cycles
         */
        intervalTo?: number;
    }
    /**
     * @description resize settings
     */
    resize?: {
        /**
         * @param boolean
         * @description use or not
         */
        use?: boolean;
        /**
         * @param number
         * @description debounce time
         */
        debounce?: number;
    };
    /**
     * @description not animate when sprite is not in viewport
     */
    intersection?: {
        /**
         * @param boolean
         * @description use or not
         */
        use?: boolean;
        /**
         * @param IntersectionObserverInit
         * @description animate sprite when item in viewport
         */
        intersectionSettings?: IntersectionObserverInit;
    }
}

export const defaultParams: Partial<IAnimateSpriteCParams> = {
    moduleName: 'core',
    componentName: 'wlc-animate-sprite',
    class: 'wlc-animate-sprite',
    framesCount: 40,
    interval: 35,
    animateUntilMouseLeave: true,
    useEventsOnCanvas: true,
    fullAnimatingCycle: true,
    animationCycleCount: 2,
    autoAnimating: {
        use: true,
        intervalFrom: 6000,
        intervalTo: 12000,
    },
    resize: {
        use: true,
        debounce: 100,
    },
    intersection: {
        use: true,
        intersectionSettings: {
            threshold: 0.2,
        },
    },
};
