import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentType = 'easy' | CustomType;
export type ComponentTheme = 'easy' | CustomType;
export type ComponentThemeMod = 'easy' | CustomType;

export interface ISearchControlPanelCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
}

export const defaultParams: ISearchControlPanelCParams = {
    moduleName: 'games',
    class: 'wlc-search-control',
    componentName: 'search-control',
    theme: 'easy',
};
