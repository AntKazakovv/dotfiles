import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ISearchMerchantListCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
}

export const defaultParams: ISearchMerchantListCParams = {
    moduleName: 'games',
    class: 'wlc-search-merchant-list',
    componentName: 'search-merchant-list',
    theme: 'default',
};
