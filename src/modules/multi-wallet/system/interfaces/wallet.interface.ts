export interface IWallet {
    currency: string;
    balance: string | number;
    availableWithdraw?: string;
    walletId?: number;
    freerounds?: any[];
}

export interface IWalletObj {
    [key: string]: IWallet;
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
