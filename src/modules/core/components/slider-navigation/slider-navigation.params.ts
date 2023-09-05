import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'wolf' |  CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ISliderNavigationCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    iconPath?: string,
};

export const defaultParams: ISliderNavigationCParams = {
    moduleName: 'core',
    componentName: 'wlc-slider-navigation',
    class: 'wlc-slider-navigation',
    iconPath: '/wlc/icons/arrow.svg',
};
