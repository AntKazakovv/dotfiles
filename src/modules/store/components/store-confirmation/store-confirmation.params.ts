import {
    CustomType,
    IWrapperCParams,
    IComponentWithPendingBtns,
} from 'wlc-engine/modules/core';
import {
    IStoreItemTotalPrice,
    StoreItem,
} from 'wlc-engine/modules/store';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IStoreConfirmationCParams extends
    IComponentWithPendingBtns<ComponentTheme, ComponentType, ComponentThemeMod> {
    storeItem: StoreItem,
    iconConfig: IWrapperCParams;
    modalMessage: string;
    balanceMessage: string;
    storeItemTotalPrice: IStoreItemTotalPrice,
}

export const defaultParams: Partial<IStoreConfirmationCParams> = {
    moduleName: 'store',
    componentName: 'wlc-store-confirmation',
    class: 'wlc-store-confirmation',
    iconConfig: {
        components: [
            {
                name: 'core.wlc-icon',
                params: {
                    iconPath: '/wlc/icons/status/confirm.svg',
                },
            },
        ],
    },
    modalMessage: gettext('Are you sure?'),
    balanceMessage: gettext('Your balance will be debited:'),
    storeItemTotalPrice: {
        loyaltyPrice: 0,
        expPrice: 0,
        moneyPrice: 0,
        moneyCurrency: 'EUR',

    },
    btnsParams: {
        buyBtnParams: {
            common: {
                text: gettext('Buy now'),
                typeAttr: 'button',
            },
            wlcElement: 'button_buy',
        },
    },
};
