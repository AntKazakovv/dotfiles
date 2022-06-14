
export interface IFinancesConfig {
    fastDeposit: IFastDeposit;
    payment?: IAutoSelect;
}

export interface IFastDeposit {
    use: boolean;
}

export type TTranslate = 'pay_to_address' | 'pay_to_bank' | 'html';

export interface IPaymentMessage {
    amount?: string;
    translate?: TTranslate;
    address?: string;
    qrlink?: string;
    wallet_currency?: string;
    details?: string;
    tag?: string;
    x_address?: string;
    html?: string;
    scripts?: string[];
    rate?: string;
    memo?: string;
}

export type TBets = IBet[];

export interface IBet {
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
    alias?: string | number | IAliasByDevice;
}

export interface IAliasByDevice {
    mobile?: string | number;
    desktop?: string | number;
}
