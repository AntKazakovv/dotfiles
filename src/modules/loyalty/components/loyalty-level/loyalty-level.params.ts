import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'compact' | CustomType;

export interface ILoyaltyLevelCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /**
     * Ordinal number of the level
     */
    level?: string,
    /**
     * Level name
     */
    name?: string,
    /**
     * Level scores count
     */
    points?: string,
    /**
     * Optional additional information
     */
    description?: string,
    /**
     * Primary image's source
     */
    image?: string,
    /**
     * Defines what should be shown as a title
     */
    titleAs?: boolean,
    /**
     * Level matches to user level
     */
    isUserLevel?: boolean,
}

export const defaultParams: ILoyaltyLevelCParams = {
    moduleName: 'loyalty',
    componentName: 'wlc-loyalty-level',
    class: 'wlc-loyalty-level',
    titleAs: false,
};
