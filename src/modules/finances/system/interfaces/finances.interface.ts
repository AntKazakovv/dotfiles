
export interface IFinancesConfig {
    fastDeposit: IFastDeposit;
}

export interface IFastDeposit {
    use: boolean;
}

export interface ICryptoMessage {
    address: string;
    qrlink: string;
    translate: string;
    wallet_currency: string;
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


