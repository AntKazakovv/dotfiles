import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'overflow' | CustomType;

export interface IFrameDepositCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
};

export const defaultParams: IFrameDepositCParams = {
    moduleName: 'finances',
    componentName: 'wlc-iframe-deposit',
    class: 'wlc-iframe-deposit',
};
