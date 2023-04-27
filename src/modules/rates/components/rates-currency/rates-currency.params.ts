import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IRatesCurrencyParams extends IComponentParams<ComponentTheme, ComponentType, string> {}

export const defaultParams: IRatesCurrencyParams = {
    class: 'wlc-rates-currency',
    componentName: 'wlc-rates-currency',
    moduleName: 'rates',
};
