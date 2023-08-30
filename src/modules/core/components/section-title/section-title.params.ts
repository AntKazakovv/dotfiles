import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'wolf' |  CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ISectionTitleCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    text?: string,
    iconPath?: string;
    iconFallback?: string,
    arrowLinkIconPath?: string,
    noUseArrowLinkIcon?: boolean,
};

export const defaultParams: ISectionTitleCParams = {
    class: 'wlc-section-title',
    componentName: 'wlc-section-title',
    moduleName: 'core',
    arrowLinkIconPath: '/wlc/icons/arrow-right.svg',
};
