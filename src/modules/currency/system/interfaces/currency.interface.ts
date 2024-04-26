export interface CurrencyName {
    name: string;
    displayName: string;
}

export type TDisplayName = Record<string, string> | null | string;

export interface ICurrency<T extends TDisplayName> {
    Alias: string;
    ID?: string | number;
    ExRate?: string;
    registration?: boolean;
    IsCryptoCurrency?: boolean;
    Name: string;
    DisplayName: T;
}