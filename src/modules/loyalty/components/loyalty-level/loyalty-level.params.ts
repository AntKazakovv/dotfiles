import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;

export type ComponentType = 'default' | CustomType;

export interface ILoyaltyLevelCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    /**
     * Ordinal number of the level
     */
    level: string,
    /**
     * Level name
     */
    name: string,
    /**
     * Level scores count
     */
    points: string,
    /**
     * Optional additional information
     */
    description: string,
    /**
     * Primary image's source
     */
    image: string,
    /**
     * Path to image will be shown if primary image isn't loaded
     */
    fallbackImage: string,
    /**
     * Defines what should be shown as a title
     */
    titleAs?: boolean,
};

export const defaultParams: Partial<ILoyaltyLevelCParams> = {
    moduleName: 'loyalty',
    componentName: 'wlc-loyalty-level',
    class: 'wlc-loyalty-level',
    titleAs: false,
};
