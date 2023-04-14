import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IClearAmountButtonCParams extends IComponentParams<Theme, Type, ThemeMod> {
    isAmountEmpty: boolean;
}

export const defaultParams: IClearAmountButtonCParams = {
    moduleName: 'finances',
    class: 'wlc-clear-amount-button',
    componentName: 'wlc-clear-amount-button',
    isAmountEmpty: true,
};
