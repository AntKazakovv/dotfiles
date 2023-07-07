import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';
import {
    IWallet,
    IWalletObj,
} from 'wlc-engine/modules/multi-wallet';

export class WalletHelper {
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
