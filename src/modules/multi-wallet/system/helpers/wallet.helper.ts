import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';
import {
    ICurrencyFilter,
    IWallet,
    IWalletObj, IWalletsSettings,
} from 'wlc-engine/modules/multi-wallet';
import {IIndexing} from 'wlc-engine/modules/core';

export class WalletHelper {
    public static coefficientOriginalCurrencyСonversion: number = 1;
    public static coefficientСonversion: number = 1;
    public static coefficientСonversionEUR: number = 1;
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
        WalletHelper.coefficientСonversion = 1;
        WalletHelper.coefficientOriginalCurrencyСonversion = 1;
        WalletHelper.coefficientСonversionEUR = 1;
        WalletHelper.conversionCurrency = null;
    }
}
