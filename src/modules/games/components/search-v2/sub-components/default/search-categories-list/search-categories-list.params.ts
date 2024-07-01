import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ICategoriesListCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
}

export const defaultParams: ICategoriesListCParams = {
    moduleName: 'games',
    class: 'wlc-search-categories-list',
    componentName: 'search-categories-list',
    theme: 'default',
};
