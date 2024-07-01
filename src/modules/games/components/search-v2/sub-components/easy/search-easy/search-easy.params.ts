import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentType = 'easy' | CustomType;
export type ComponentTheme = 'easy' | CustomType;
export type ComponentThemeMod = 'easy' | CustomType;

export interface ISearchEasyCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
}

export const defaultParams: ISearchEasyCParams = {
    moduleName: 'games',
    class: 'wlc-search-easy',
    componentName: 'search-easy',
    theme: 'easy',
};
