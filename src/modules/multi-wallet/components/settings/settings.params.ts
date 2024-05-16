import {
    CustomType, ICheckboxCParams,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {CurrencyName} from 'wlc-engine/modules/currency/system/interfaces/currency.interface';
import {IWalletsSettings} from 'wlc-engine/modules/multi-wallet';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ISettingsParams extends IComponentParams<Theme, Type, ThemeMod> {
    walletSettings: IWalletsSettings;
    hideWalletText?: string;
    viewFiatText?: string;
    currencies?: CurrencyName[];
    descriptionText?: string;
    infoBlockText?: string;
    toggleHideZero?: ICheckboxCParams;
    toggleViewFiat?: ICheckboxCParams;
}

export const defaultParams: ISettingsParams = {
    class: 'wlc-settings',
    moduleName: 'multi-wallet',
    componentName: 'wlc-settings',
    hideWalletText: gettext('Hide zero balances'),
    currencies: [],
    viewFiatText: gettext('View in fiat'),
    descriptionText: gettext('Select the fiat currency to display your bets'),
    infoBlockText: gettext('Please note that the currency amounts are approximate'),
    toggleHideZero: {
        name: 'hideZeroBalances',
        theme: 'toggle',
    },
    toggleViewFiat: {
        name: 'viewFiat',
        theme: 'toggle',
    },
    walletSettings: {
        hideWalletsWithZeroBalance: false,
        conversionInFiat: false,
        currency: '',
    },
};
