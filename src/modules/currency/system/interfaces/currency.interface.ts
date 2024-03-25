export interface CurrencyName {
    name: string;
    displayName: string
}
export interface ICurrency {
    Alias: string,
    ID?: string | number,
    ExRate?: string,
    registration?: boolean,
    IsCryptoCurrency?: boolean,
    Name: string;
    DisplayName: Record<string, string> | null,
}

export interface ICurrencyModel {
    Alias: string,
    ID?: string | number,
    ExRate?: string,
    registration?: boolean,
    IsCryptoCurrency?: boolean,
    Name: string;
    DisplayName: string;
}
