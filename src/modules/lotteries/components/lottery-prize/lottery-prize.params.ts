import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILotteryPrizeCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    divider?: string;
};

export const defaultParams: ILotteryPrizeCParams = {
    class: 'wlc-lottery-prize',
    componentName: 'wlc-lottery-prize',
    moduleName: 'lotteries',
    divider: '+',
};
