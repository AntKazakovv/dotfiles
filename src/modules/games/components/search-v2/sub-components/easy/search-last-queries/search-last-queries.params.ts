import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ISearchLastQueriesCParams extends
IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
}

export const defaultParams: ISearchLastQueriesCParams = {
    moduleName: 'games',
    class: 'wlc-search-last-queries',
    componentName: 'search-last-queries',
    theme: 'default',
};
