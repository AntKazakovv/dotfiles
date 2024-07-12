import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IAchievementTagCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /**
     * Tag text
     */
    text?: string;
}

export const defaultParams: IAchievementTagCParams = {
    moduleName: 'achievements',
    componentName: 'wlc-achievement-tag',
    class: 'wlc-achievement-tag',
};
