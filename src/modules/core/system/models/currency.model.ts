import {CurrenciesInfo} from 'wlc-engine/modules/core/constants/currencies-info.constants';

import {
    findIndex as _findIndex,
    toInteger as _toInteger,
    toNumber as _toNumber,
    toUpper as _toUpper,
    padEnd as _padEnd,
    concat as _concat,
    reduce as _reduce,
    split as _split,
    find as _find,
    join as _join,
    map as _map,
} from 'lodash-es';

interface IParsedDigitsInfo {
    minimumIntegerDigits: number;
    minimumFractionDigits: number;
    maximumFractionDigits: number;
}

export interface ICurrencyIcon {
    prefix?: string;
    iconChar: string;
    placement: 'left' | 'right';
    minusBeforeCurrency: boolean;
}

export interface ICurrencyOptions {
    language?: string;
    currency?: string;
    digitsInfo?: string;
}

export class CurrencyModel {
    public readonly numericValue = _toNumber(this.value) || 0;
    public currencyParts: Intl.NumberFormatPart[];
    public icon: ICurrencyIcon;
    public isCryptocurrency: boolean;
    protected formatOptions: ICurrencyOptions;

    constructor(
        public readonly value: string | number,
        options: ICurrencyOptions = null,
    ) {
        this.formatOptions = {
            currency: 'EUR',
            digitsInfo: '1-2-2',
            language: 'en',
            ...options,
        };
        this.isCryptocurrency = CurrenciesInfo.cryptocurrencies.has(
            _toUpper(this.formatOptions.currency).trim(),
        );

        this.formatValue();
        if (this.currencyFormat.icon) {
            this.setIcon();
        }
    }

    public toString(): string {
        return _join(_map(this.currencyParts, (part) => part.value), '');
    }

    /**
     * @returns {Object} format options for current currency or empty object
     */
    protected get currencyFormat(): CurrenciesInfo.ICurrencyFormat {
        return CurrenciesInfo.formats[_toUpper(this.formatOptions.currency).trim()]
            || {};
    }

    protected formatValue(): void {
        const parts = Intl.NumberFormat(this.formatOptions.language, {
            style: 'currency',
            // pass USD if this is cryptocurrency, otherwise Intl inserts literal
            currency: this.isCryptocurrency ? 'USD' : _toUpper(this.formatOptions.currency).trim(),
            currencyDisplay: CurrenciesInfo.containingCountrySymbol.has(this.formatOptions.currency)
                ? 'symbol'
                : 'narrowSymbol',
            useGrouping: true,
            ...this.getParsedDigitsInfo(2),
        }).formatToParts(this.numericValue);

        this.currencyParts = this.isCryptocurrency
            ? this.formatToCryptocurrency(parts)
            : parts;
    }

    /**
     * Transforms Intl format to cryptocurrency
     *
     * @param intlParts parts from Intl
     */
    protected formatToCryptocurrency(parts: Intl.NumberFormatPart[]): Intl.NumberFormatPart[] {
        return _reduce(parts, (acc, part) => {
            if (part.type === 'currency') {
                part.value = this.getCryptocurrencyIndicator();
            } else if (part.type === 'fraction') {
                part.value = this.getCryptocurrencyFraction();
            } else if (part.type === 'minusSign' && this.icon.placement === 'left') {
                return acc;
            }

            return _concat(acc, part);
        }, []);
    }

    /**
     * @returns {string} indicator in available format
     */
    protected getCryptocurrencyIndicator(): string {
        const indicatorFormat: string = _find(
            ['narrowSymbol', 'symbol', 'code'],
            (indicatorFormat) => !!this.currencyFormat[indicatorFormat],
        );

        const chars: readonly number[] = this.currencyFormat[indicatorFormat];

        if (!chars) {
            return _toUpper(this.formatOptions.currency).trim();
        }

        return String.fromCharCode(...chars);
    }

    /**
     * Intl doesn't format fraction with more then 2 digits after decimal point, so it has to be done manually
     */
    protected getCryptocurrencyFraction(): string {
        const digitsInfo = this.getParsedDigitsInfo(this.currencyFormat.precision ?? 2);

        return _padEnd(
            _toNumber(this.numericValue.toString())
                .toFixed(digitsInfo.maximumFractionDigits)
                .toString()
                .split('.')[1],
            digitsInfo.minimumFractionDigits,
            '0',
        );
    }

    protected setIcon(): void {
        const {currencyParts} = this;

        const minusSignIndex: number = _findIndex(currencyParts, {type: 'minusSign'});
        const currencyIndex: number = _findIndex(currencyParts, {type: 'currency'});
        const integerIndex: number = _findIndex(currencyParts, {type: 'integer'});

        this.icon = {
            iconChar: this.currencyFormat.icon,
            minusBeforeCurrency: minusSignIndex < currencyIndex,
            placement: integerIndex < currencyIndex
                ? 'right'
                : 'left',
        };

        if (this.currencyFormat.iconPrefix) {
            this.icon.prefix = String.fromCharCode(this.currencyFormat.iconPrefix);
        }
    }

    /**
     * Parses digitsInfo and transforms its values in safe range
     *
     * @param allowFractionDigits how long faction can be
     * @returns {Object} parsed and secured digitsInfo
     */
    protected getParsedDigitsInfo(allowFractionDigits: number): IParsedDigitsInfo {
        const [
            minimumIntegerDigits,
            minimumFractionDigits,
            maximumFractionDigits,
        ] = _map(
            _split(this.formatOptions.digitsInfo, '-'),
            _toInteger,
        );

        return {
            minimumIntegerDigits: this.putInRange(minimumIntegerDigits || 1, 1, 21),
            minimumFractionDigits: this.putInRange(minimumFractionDigits ?? 2, 0, allowFractionDigits),
            maximumFractionDigits: this.putInRange(maximumFractionDigits ?? 2, 0, allowFractionDigits),
        };
    }

    protected putInRange(num: number, start: number, end: number): number {
        const min = Math.max(num, start);
        return Math.min(min, end);
    }
}
