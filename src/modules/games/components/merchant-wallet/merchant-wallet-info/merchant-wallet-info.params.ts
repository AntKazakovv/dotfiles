import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IMerchantWalletInfoCParams extends
    IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {

};

export const defaultParams: IMerchantWalletInfoCParams = {
    class: 'wlc-merchant-wallet-info',
    componentName: 'wlc-merchant-wallet-info',
    moduleName: 'games',
};
