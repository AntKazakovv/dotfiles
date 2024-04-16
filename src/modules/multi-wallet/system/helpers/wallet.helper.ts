import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';
import {
    ICurrencyFilter,
    IWallet,
    IWalletObj,
    IWalletsSettings,
} from 'wlc-engine/modules/multi-wallet';
import {
    GlobalHelper,
    IIndexing,
} from 'wlc-engine/modules/core';

export class WalletHelper {
    public static coefficientOriginalCurrencyConversion: number = 1;
    public static coefficientConversion: number = 1;
    public static coefficientConversionEUR: number = 1;
    public static conversionCurrency: string;
    public static rates: IIndexing<number> = {};
    public static currencies: ICurrencyFilter[];
    public static walletSettings: IWalletsSettings;
    public static readyMultiWallet: Promise<void> = new Promise((resolve: () => void): void => {
        WalletHelper.$resolveMultiWallet = resolve;
    });

    public static $resolveMultiWallet: () => void;
    public static createCurrentWallet(
        wallets: IWalletObj,
        currency: string,
    ): IWallet {
        let currentWallet: IWallet = _assign(
            {},
            wallets,
        )[currency];

        if (!currentWallet) {
            currentWallet = {
                currency: currency,
                balance: '0',
                availableWithdraw: '0',
            };
        }
        currentWallet.balance = _toNumber(currentWallet.balance).toFixed(2);
        return currentWallet;
    }

    public static conversionReset(): void {
        WalletHelper.coefficientConversion = 1;
        WalletHelper.coefficientOriginalCurrencyConversion = 1;
        WalletHelper.coefficientConversionEUR = 1;
        WalletHelper.conversionCurrency = null;
    }

    public static getCurrencyIconUrl(currency: string): string {
        return GlobalHelper.proxyUrl(`/wlc/icons/currencies/${currency.toLowerCase()}.svg`);
    }
}
