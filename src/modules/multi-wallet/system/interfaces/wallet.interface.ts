export interface IWallet {
    currency?: string;
    displayName?: string;
    balance?: string | number;
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

// TODO заменить в дальнейшем на IIndexing
export interface IWalletObj {
    [currency: string]: IWallet;
}

export interface IWSWalletObj {
    [id: string]: IWSWallet;
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

export interface ICurrencyFilter {
    name: string;
    code: string;
    isUsed: boolean;
}

export enum MultiWalletEvents {
    CurrencyConversionChanged = 'CHANGE_CURRENCY_CONVERSION',
    WalletChanged = 'CHANGE_WALLET',
    CreateWallet = 'CREATE_WALLET',
}
