import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IMerchantWalletPreviewCParams extends
    IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {

};

export const defaultParams: IMerchantWalletPreviewCParams = {
    class: 'wlc-merchant-wallet-preview',
    componentName: 'wlc-merchant-wallet-preview',
    moduleName: 'games',
};
