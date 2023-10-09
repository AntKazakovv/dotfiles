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
}
