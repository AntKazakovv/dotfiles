import {Observable} from 'rxjs';

import {CurrencyName} from 'wlc-engine/modules/currency';
import {Bonus} from 'wlc-engine/modules/bonuses';
import {StoreItem} from 'wlc-engine/modules/store';
import {Tournament} from 'wlc-engine/modules/tournaments';

export interface IWallet {
    currency?: string;
    displayName?: string;
    balance?: string | number | Observable<number>;
    availableWithdraw?: string;
    walletId?: number;
    freerounds?: any[];
}

export interface IWSWallet {
    Balance: string;
    Currency: string;
    availableWithdraw?: string;
    WalletId?: number;
}

export interface ICreatedWallet {
    result: boolean;
    walletId: string;
}

export interface IGettingWallet {
    ID: number;
    Currency: string;
    Balance: number;
    Login: string;
    Status: number;
}

export interface ISelectedWallet {
    walletCurrency: string;
    walletId?: number;
}

export interface IWalletsSettings {
    hideWalletsWithZeroBalance?: boolean;
    conversionInFiat?: boolean;
    currency?: string;
}

export interface ICurrencyConversion {
    /**
     * Currency from which conversion is required. Value must be in uppercase.
     */
    currencyFrom: string;
    /**
     * Currency to be converted. Value must be in uppercase.
     */
    currencyTo: string;

    /**
     * Conversion result
     */
    estimatedAmount?: number;
}

export interface ICurrencyFilter extends CurrencyName {
    isUsed: boolean;
}

export enum MultiWalletEvents {
    CurrencyConversionChanged = 'CHANGE_CURRENCY_CONVERSION',
    WalletChanged = 'CHANGE_WALLET',
    CreateWallet = 'CREATE_WALLET',
}

export interface IAmount {
    value: number | string;
    currency: string;
    conversionCurrency?: string;
}

export type TWalletConfirmItem = Bonus | StoreItem | Tournament;

export interface IWalletConfirmController {
    subscribe(): Promise<void>;
    // TODO: add second parameter - balance (for calculating isBalanceEnough prop)
    onWalletChange(wallet: ISelectedWallet, balance?: number): void;
    /** Does we have or not enough money on current wallet for loyalty operation */
    isBalanceEnough?: boolean;
    debitAmount?: IAmount[];
    creditAmount?: IAmount[];
}
