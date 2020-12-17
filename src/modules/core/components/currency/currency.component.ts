import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Inject,
    Input,
    OnChanges,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';

import * as CurrencyParams from './currency.params';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {isNegative, putInRange} from 'wlc-engine/helpers/functions';
import {
    ICurrencyFormat,
    CRYPTOCURRENCIES,
    ICryptocurrencies,
} from 'wlc-engine/modules/core/constants/currency-formats.constant';
import {ConfigService} from 'wlc-engine/modules/core';

import {
    findIndex as _findIndex,
    toInteger as _toInteger,
    toNumber as _toNumber,
    includes as _includes,
    toLower as _toLower,
    toUpper as _toUpper,
    padEnd as _padEnd,
    concat as _concat,
    reduce as _reduce,
    split as _split,
    find as _find,
    map as _map,
} from 'lodash';

interface IParsedDigitsInfo {
    minimumIntegerDigits: number;
    minimumFractionDigits: number;
    maximumFractionDigits: number;
}

interface IDisplayIcon {
    icon: string;
    placement: 'left' | 'right';
    minusBeforeCurrency: boolean;
}

/**
 * @alias
 */
type CurrencyPart = Intl.NumberFormatPart;

/**
 * @ngModule CoreModule
 * @description
 * 
 * Displays given number, formatted according passed options
 * or application state.
 * 
 * Supports ISO 4217 and cryptocurrencies.
 * 
 * It gets formatted value from Intl and transforms it if it is unsupported cryptocurrency
 */
@Component({
    selector: '[wlc-currency]',
    templateUrl: './currency.component.html',
    styleUrls: ['./currency.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyComponent
    extends AbstractComponent
    implements OnInit, OnChanges {

    /**
     * @description
     * Number that should be formatted.
     * 
     * @default 0
     */
    @Input()
    public get value(): number {
        return this._value || 0;
    }
    public set value(newValue: number) {
        this._value = _toNumber(newValue);
    }
    private _value: number;

    /**
     * @description
     * Currency code according to ISO 4217.
     */
    @Input()
    public get currency(): string {
        return this._currency;
    }
    public set currency(newValue: string) {
        this._currency = _toUpper(newValue).trim();
    }
    private _currency: string;

    /**
     * @description
     * The format for the currency indicator. Options:
     * - `code`: show the code;
     * - `symbol`: show symbol with county-specific symbols (for example CA$ for canadian dollar);
     * - `symbolNarrow`: show symbol without country-specific symbols.
     * - `name`: show currency name in given locale (not supported by cryptocurrencies)
     * 
     * @default 'symbol'
     */
    @Input() public indicatorFormat: CurrencyParams.IndicatorFormatType;

    /**
     * @description
     * Locale in form of BCP 47 tag according which value will be formatted.
     * 
     * @default Current language
     */
    @Input() public locale: string;

    /**
     * @description
     * Display options in the following format:
     * 
     * `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`.
     * 
     * - `minIntegerDigits` - minimum number of digits before decimal point.
     * - `minFractionDigits` - minimum number of digits after decimal point.
     * - `maxFractionDigits` - maximum number of digits after decimal point.
     * 
     * Example: For value `1` and digitsInfo `2-1-2` result would be `01.0`
     * 
     * @default '1-2-2''
     */
    @Input() public digitsInfo: string;

    /**
     * Classes that would be bind to host element
     */
    @HostBinding('class')
    public get classList(): string {
        const currencyModifier: string = _toLower(this.currency);
        const signModifier: string = isNegative(this.value)
            ? 'negative'
            : 'positive';

        return [
            `${this.$class}--${currencyModifier}`,
            `${this.$class}--${signModifier}`,
        ].join(' ');
    }

    /**
     * Whether currency value is negative
     */
    public get isNegative(): boolean {
        return isNegative(this.value);
    }

    /**
     * Result that would be displayed
     */
    public displayValue: string;

    /**
     * Boolean that indicating whether the currency symbol will be displayed as an icon.
     * 
     * Icon used in case the cryptocurrency symbol doesn't exist in UTF-16.
     */
    public useIcon: boolean = false;

    /**
     * Object that template will take as a guidance in case currency symbol displays as an icon.
     * 
     * - `icon`: char for an icon;
     * - `placement`: where it should be placed, on the left side of the value or the right side;
     * - `minusBeforeCurrency`: whether should minus sign be placed before icon if the value is negative
     * and the currency icon is on the left side.
     */
    public displayIcon: IDisplayIcon;

    /**
     * Array with cryptocurrency codes
     */
    protected cryptocurrenciesList: string[] = Object.keys(this.cryptocurrencies);

    protected params: CurrencyParams.ICurrencyParams = {
        ...CurrencyParams.defaultParams,
        ...this.configService.get<CurrencyParams.ICurrencyParams>(
            `$modules.${CurrencyParams.defaultParams.moduleName}.components.${CurrencyParams.defaultParams.componentName}`,
        ),
    };

    /**
     * @returns {Object} format options for current currency or empty object
     */
    protected get currencyFormat(): ICurrencyFormat {
        return this.cryptocurrencies[this.currency] || {};
    }

    /**
     * @returns {boolean} indicator whether current currency is cryptocurrency
     */
    protected get isCryptocurrency(): boolean {
        return _includes(
            this.cryptocurrenciesList,
            this.currency,
        );
    }

    constructor(
        protected configService: ConfigService,
        @Inject(CRYPTOCURRENCIES)
        protected cryptocurrencies: ICryptocurrencies,
        @Inject('injectParams')
        injectParams: CurrencyParams.ICurrencyParams,
    ) {
        super({injectParams, defaultParams: CurrencyParams.defaultParams}, configService);
    }

    /**
     * Reevaluate values on each binding change
     */
    public ngOnChanges(): void {
        this.setDefaultValues();
        this.setIndicatorFormat();
        this.setDisplayValue();
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
        ] = _map(_split(this.digitsInfo, '-'), _toInteger);

        return {
            minimumIntegerDigits: putInRange(minimumIntegerDigits || 1, 1, 21),
            minimumFractionDigits: putInRange(minimumFractionDigits ?? 2, 0, allowFractionDigits),
            maximumFractionDigits: putInRange(maximumFractionDigits ?? 2, 0, allowFractionDigits),
        };
    }

    /**
     * Sets default values for input if they weren't specified:
     * 
     * - `locale`: current site locale;
     * - `digitsInfo`: empty string.
     */
    protected setDefaultValues(): void {
        const {defaultCurrency, defaultLocale, defaultIndicator, defaultDigitsInfo} = this.params;

        this.currency
            = this.currency
            || defaultCurrency;

        this.locale
            = this.locale
            || defaultLocale
            || this.configService.get('appConfig.language');

        this.digitsInfo
            = this.digitsInfo
            || defaultDigitsInfo;

        this.indicatorFormat
            = this.indicatorFormat
            || defaultIndicator;
    }

    /**
     * For cryptocurrencies it looks for desirable format first, if it isn't found
     * it looks for the available one in the following order:
     * 
     * symbol -> narrowSymbol -> code -> name.
     * 
     * For other currencies it sets 'symbol' if indicator format wasn't specified
     */
    protected setIndicatorFormat(): void {
        if (this.isCryptocurrency) {
            this.indicatorFormat = _find<CurrencyParams.IndicatorFormatType>(
                [this.indicatorFormat, 'symbol', 'narrowSymbol', 'code', 'name'],
                (indicator) => !!this.currencyFormat[indicator],
            );
        } else {
            this.indicatorFormat = this.indicatorFormat || 'symbol';
        }
    }

    /**
     * Sets icon display information
     * 
     * @param intlParts parts from Intl
     */
    protected setIcon(intlParts: CurrencyPart[]): void {
        const minusSignIndex: number = _findIndex(intlParts, {type: 'minusSign'});
        const currencyIndex: number  = _findIndex(intlParts, {type: 'currency'});
        const integerIndex: number   = _findIndex(intlParts, {type: 'integer'});

        this.displayIcon = {
            icon: this.currencyFormat.icon,
            minusBeforeCurrency: minusSignIndex < currencyIndex,
            placement: integerIndex < currencyIndex
                ? 'right'
                : 'left',
        };
    }

    /**
     * Gets value formatted by Intl and transforms it if it's cryptocurrency
     */
    protected setDisplayValue(): void {
        this.useIcon = !!this.currencyFormat.icon;

        let intlParts: CurrencyPart[] = this.getIntlParts();

        if (this.useIcon) {
            this.setIcon(intlParts);
        } else {
            this.displayIcon = null;
        }

        if (this.isCryptocurrency) {
            intlParts = this.formatToCryptocurrency(intlParts);
        }

        this.displayValue = _map(intlParts, (part) => part.value).join('');
    }

    /**
     * Formats value according to ISO 4217
     */
    protected getIntlParts(): CurrencyPart[] {

        return Intl.NumberFormat(this.locale, {
            style: 'currency',
            // pass usd if this is cryptocurrency, otherwise Intl inserts literal
            currency: this.isCryptocurrency ? 'usd' : this.currency,
            currencyDisplay: this.indicatorFormat,
            useGrouping: true,
            ...this.getParsedDigitsInfo(2),
        }).formatToParts(this.value);
    }

    /**
     * Transforms Intl format to cryptocurrency
     * 
     * @param intlParts parts from Intl
     */
    protected formatToCryptocurrency(
        intlParts: CurrencyPart[],
    ): CurrencyPart[] {

        return _reduce(intlParts, (acc, part) => {
            if (part.type === 'currency') {
                part.value = this.getCryptocurrencyIndicator();
            } else if (part.type === 'fraction') {
                part.value = this.getCryptocurrencyFraction();
            } else if (part.type === 'minusSign' && this.displayIcon.placement === 'left') {
                return acc;
            }

            return _concat(acc, part);
        }, []);
    }

    /**
     * @returns {string} indicator in desired format or empty string if icon would be used
     */
    protected getCryptocurrencyIndicator(): string {
        if (this.useIcon) {
            return '';
        }

        const chars: readonly number[] = this.currencyFormat[this.indicatorFormat];

        if (!chars) {
            return this.currency;
        }

        return String.fromCharCode(...chars);
    }

    /**
     * Intl doesn't format fraction with more then 2 digits after decimal point, so it has to be done manually
     */
    protected getCryptocurrencyFraction(): string {
        const digitsInfo = this.getParsedDigitsInfo(this.currencyFormat.precision ?? 2);

        return _padEnd(
            _toNumber(this.value.toString())
                .toFixed(digitsInfo.maximumFractionDigits)
                .toString()
                .split('.')[1],
            digitsInfo.minimumFractionDigits,
            '0',
        );
    }
}
