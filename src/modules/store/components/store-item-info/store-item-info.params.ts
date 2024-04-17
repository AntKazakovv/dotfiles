import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {StoreItem} from 'wlc-engine/modules/store';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IStoreItemInfoCParams extends IComponentParams<Theme, Type, ThemeMod> {
    /** Text for title */
    title: string,
    /** Store item description */
    description: string,
    /** Use alert or not */
    isDisabled: boolean,
    storeItem: StoreItem,
    // TODO is a temporary solution
    multyWalletWarning?: string;
    /** Alert message */
    disabledMsg: string,
    priceLoyalty: number,
    priceExp: number,
    canBuy: boolean,
}

export const defaultParams: Partial<IStoreItemInfoCParams> = {
    moduleName: 'store',
    componentName: 'wlc-store-item-info',
    class: 'wlc-store-item-info',
    title: '',
    description: '',
    isDisabled: false,
    multyWalletWarning: gettext('Please note that some transactions are processed only through your main wallet.'),
    priceLoyalty: 0,
    priceExp: 0,
    canBuy: false,
};
