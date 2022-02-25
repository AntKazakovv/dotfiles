import {BehaviorSubject} from 'rxjs';

import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

/**
 * @param value `BehaviorSubject<number>` provides amount to be exchanged to USD
 * @param currency user currency
 */
export interface IMerchantWalletExrateCParams extends
    IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    value: BehaviorSubject<number>,
    currency: string,
};

export const defaultParams: Partial<IMerchantWalletExrateCParams> = {
    class: 'wlc-merchant-wallet-exrate',
    componentName: 'wlc-merchant-wallet-exrate',
    moduleName: 'games',
};
