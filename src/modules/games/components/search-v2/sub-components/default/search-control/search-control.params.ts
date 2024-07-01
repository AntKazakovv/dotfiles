import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ISearchControlPanelCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
}

export const defaultParams: ISearchControlPanelCParams = {
    moduleName: 'games',
    class: 'wlc-search-control',
    componentName: 'search-control',
    theme: 'default',
};
