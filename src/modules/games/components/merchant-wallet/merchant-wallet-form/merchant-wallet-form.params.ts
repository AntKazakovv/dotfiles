import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {TBalanceTransferMethod} from 'wlc-engine/modules/games/system/services';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;
export interface IMerchantWalletFormCParams extends
    IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    method: TBalanceTransferMethod,
};

export const defaultParams: Partial<IMerchantWalletFormCParams> = {
    class: 'wlc-merchant-wallet-form',
    componentName: 'wlc-merchant-wallet-form',
    moduleName: 'games',
};
