import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IFinishedLotteryCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {

};

export const defaultParams: IFinishedLotteryCParams = {
    class: 'wlc-finished-lottery',
    componentName: 'wlc-finished-lottery',
    moduleName: 'lotteries',
};
