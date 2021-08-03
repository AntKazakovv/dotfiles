
export interface IFinancesConfig {
    fastDeposit: IFastDeposit;
    payment?: IAutoSelect;
}

export interface IFastDeposit {
    use: boolean;
}

export interface IPaymentMessage {
    translate: string;
    address?: string;
    qrlink?: string;
    wallet_currency?: string;
    details?: string;
}

export interface IBet {
    Action: string;
    Amount: string;
    Currency: string;
    Date: string;
    DateISO: string;
    GameID: string;
    GameName: string;
    Merchant: string;
}

export interface IAutoSelect {
    autoSelect: boolean;
    alias?: string;
}
