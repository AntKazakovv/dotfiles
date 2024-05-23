import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILotteriesHistoryCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    limit?: number;
};

export const defaultParams: ILotteriesHistoryCParams = {
    class: 'wlc-lotteries-history',
    componentName: 'wlc-lotteries-history',
    moduleName: 'lotteries',
    limit: 10,
};
