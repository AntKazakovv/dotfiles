export interface IRatesCurrency {
    base: string;
    crypto_rate: string;
    fiat_rate: string;
    rate: number;
}

export interface ICoupleCurrency {
    cryptoCurrency: string;
    currency: string;
}
