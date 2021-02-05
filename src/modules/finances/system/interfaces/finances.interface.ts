
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
