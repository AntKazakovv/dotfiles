export namespace CurrenciesInfo {

    export interface ICurrencyFormat {
        readonly code?: readonly number[];
        readonly symbol?: readonly number[];
        readonly narrowSymbol?: readonly number[];
        readonly iconPrefix?: number;
        readonly icon?: string;
        readonly svg?: string;
        readonly name?: string;
        readonly description?: string;
        readonly precision?: number;
        /**
         * Use for custom or non-standard (not iso 4217) currencies
         * If USD (default) - Intl doesn't insert literal, if BTC - Intl inserts literal
         */
        readonly literalAs?: 'USD' | 'BTC';
    }

    export interface ICurrencies {
        readonly [currency: string]: ICurrencyFormat;
    }

    export const containingCountrySymbol: ReadonlySet<string> = new Set<string>([
        'ARS',
        'AUD',
        'BND',
        'CAD',
        'CLP',
        'COP',
        'GYD',
        'HKD',
        'LRD',
        'MXN',
        'NZD',
        'TWD',
        'UYU',
        'BRL',
        'CNY',
        'JPY',
        // It could be prefixed. For example on "en-CA" locale it would look like "US$0.00",
        // and canadian dollar would be just $0.00
        'USD',
    ]);

    export const cryptocurrencies: ReadonlySet<string> = new Set<string>([
        'BTC',
        'MBC',
        'XB3',
        'LIT',
        'LT1',
        'LT2',
        'USDT',
        'ETH',
        'ET1',
        'ET2',
        'BCH',
        'BC1',
        'BC2',
        'DOGE',
        'EGLD',
        'BUSD',
        'LB1', // Lebanon (non standard country currency)
    ]);

    /** Special currencis, such as loyalty points, free spins, experience points and free bets */
    export const specialCurrencies: ReadonlySet<string> = new Set<string>([
        'LP',
        'FS',
        'EP',
        'FB',
    ]);

    export const formats: ICurrencies = {
        // Bitcoin
        BTC: {
            // weak OS support for char code
            // symbol: [8383],
            icon: 'c',
            code: [66, 84, 67],
            precision: 8,
        },
        // Millibitcoin
        MBC: {
            // narrowSymbol: [109, 8383],
            iconPrefix: 109,
            icon: 'c',
            code: [109, 66, 84, 67],
            precision: 5,
        },
        // Microbitcoin
        XB3: {
            // narrowSymbol: [956, 8383],
            iconPrefix: 956,
            icon: 'c',
            code: [956, 66, 84, 67],
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
            code: [109, 76, 73, 84],
            precision: 5,
        },
        // Microlitecoin
        LT2: {
            narrowSymbol: [956, 321],
            code: [956, 76, 73, 84],
            precision: 2,
        },
        // Tether
        USDT: {
            symbol: [8366],
            code: [85, 83, 68, 84],
            precision: 6,
        },
        // Ethereum
        ETH: {
            icon: 'b',
            code: [69, 84, 72],
            precision: 18,
        },
        // Milli Ethereum
        ET1: {
            iconPrefix: 109,
            icon: 'b',
            code: [109, 69, 84, 72],
            precision: 15,
        },
        // Micro Ethereum
        ET2: {
            iconPrefix: 956,
            icon: 'b',
            code: [956, 69, 84, 72],
            precision: 12,
        },
        // Bitcoin Cash
        BCH: {
            icon: 'a',
            code: [66, 67, 72],
            precision: 8,
        },
        // Milli Bitcoin Cash
        BC1: {
            iconPrefix: 109,
            icon: 'a',
            code: [109, 66, 67, 72],
            precision: 5,
        },
        // Micro Bitcoin Cash
        BC2: {
            iconPrefix: 956,
            icon: 'a',
            code: [956, 66, 67, 72],
            precision: 2,
        },
        // Azerbaijani manat
        AZN: {
            // weak OS support for char code
            // TODO
            icon: '',
        },
        // Georgian lari
        GEL: {
            // weak OS support for char code
            // TODO
            icon: '',
        },
        LP: {
            svg: '/currency/lp.svg',
            name: gettext('LP'),
            description: gettext('Loyalty Points'),
        },
        FS: {
            svg: '/currency/fs.svg',
            name: gettext('FS'),
            description: gettext('Free Spins'),
        },
        FB: {
            svg: '/currency/fb.svg',
            name: gettext('FB'),
            description: gettext('Free Bets'),
        },
        EP: {
            svg: '/currency/exp.svg',
            name: gettext('EXP'),
            description: gettext('Experience Points'),
        },
        EXP: {
            svg: '/currency/exp.svg',
            name: gettext('EXP'),
            description: gettext('Experience Points'),
        },
        DOGE: {
            symbol: [208],
        },
        // PayCryptos Elrond
        EGLD: {
            icon: '',
            literalAs: 'BTC',
        },
        BUSD: {
            icon: '',
            literalAs: 'BTC',
        },
        // Lebanon (non standard country currency)
        LB1: {
            icon: '',
            literalAs: 'BTC',
        },
    };
}
