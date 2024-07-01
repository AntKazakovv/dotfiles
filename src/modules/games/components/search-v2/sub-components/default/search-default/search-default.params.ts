import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ISearchDefaultCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
}

export const defaultParams: ISearchDefaultCParams = {
    moduleName: 'games',
    class: 'wlc-search-default',
    componentName: 'search-default',
    theme: 'default',
};
