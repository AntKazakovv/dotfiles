import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ISearchResultCParams extends
    IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
}

export const defaultParams: ISearchResultCParams = {
    moduleName: 'games',
    class: 'wlc-search-result',
    componentName: 'search-result',
    theme: 'default',
};
