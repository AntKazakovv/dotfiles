import {InjectionToken} from '@angular/core';

export interface ICurrencyFormat {
    readonly code?: readonly number[];
    readonly symbol?: readonly number[];
    readonly narrowSymbol?: readonly number[];
    readonly icon?: string;
    readonly precision?: number;
}

export interface ICryptocurrencies {
    readonly [currency: string]: ICurrencyFormat;
}

export const CRYPTOCURRENCIES = new InjectionToken<ICryptocurrencies>('Currency formats');
export const cryptocurrencies: ICryptocurrencies = {
    // Bitcoin
    BTC: {
        // weak OS support for char code
        // symbol: [8383],
        icon: 'c',
        precision: 8,
    },
    // Millibitcoin
    MBC: {
        // narrowSymbol: [109, 8383],
        symbol: [109, 66, 84, 67],
        precision: 5,
    },
    // Microbitcoin
    XB3: {
        // narrowSymbol: [956, 8383],
        symbol: [956, 66, 84, 67],
        precision: 2,
    },
    // Litecoin
    LIT: {
        symbol: [321],
        precision: 8,
    },
    // Millilitecoin
    LT1: {
        narrowSymbol: [109, 321],
        symbol: [109, 76, 73, 84],
        precision: 5,
    },
    // Microlitecoin
    LT2: {
        narrowSymbol: [956, 321],
        symbol: [956, 76, 73, 84],
        precision: 2,
    },
    // Tether
    // Doesn't have a support yet
    USDT: {
        symbol: [8366],
        code: [85, 83, 68, 84],
        precision: 6,
    },
    // Ethereum
    ETH: {
        icon: 'b',
        precision: 18,
    },
    // Milli Ethereum
    ET1: {
        symbol: [109, 69, 84, 72],
        precision: 15,
    },
    // Micro Ethereum
    ET2: {
        symbol: [956, 69, 84, 72],
        precision: 12,
    },
    // Bitcoin Cash
    BCH: {
        icon: 'a',
        precision: 8,
    },
    // Milli Bitcoin Cash
    BC1: {
        symbol: [109, 66, 67, 72],
        precision: 5,
    },
    // Micro Bitcoin Cash
    BC2: {
        symbol: [956, 66, 67, 72],
        precision: 2,
    },
};
