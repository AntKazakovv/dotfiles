import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnChanges,
    OnInit,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import * as Params from './currency.params';

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
    toUpper as _toUpper,
    padEnd as _padEnd,
    concat as _concat,
    reduce as _reduce,
    split as _split,
    each as _each,
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
    styleUrls: ['./styles/currency.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyComponent
    extends AbstractComponent
    implements OnInit, OnChanges {

    /**
     * @description
     * Value that should be formatted. Could be a number or a string (component will try to parse it to a number).
     *
     * Use BehaviorSubject if you want dynamic currency display. Number otherwise.
     *
     * @default 0
     */
    @Input() public value:
        | BehaviorSubject<number | string>
        | number
        | string;

    /**
     * @description
     * Currency code according to ISO 4217.
     */
    @Input() public currency: string;

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
    @Input() public indicatorFormat: Params.IndicatorFormatType;

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
     * Whether currency value is negative
     */
    public get isNegative(): boolean {
        return isNegative(this.numericValue);
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
    public $params: Params.ICurrencyParams;

    protected numericValue: number;

    /**
     * Intl format for currency
     */
    protected intlCurrencyFormat: Intl.NumberFormat;

    /**
     * Array with cryptocurrency codes
     */
    protected cryptocurrenciesList: string[] = Object.keys(this.cryptocurrencies);

    /**
     * @returns {Object} format options for current currency or empty object
     */
    protected get currencyFormat(): ICurrencyFormat {
        return this.cryptocurrencies[_toUpper(this.$params.currency).trim()]
            || {};
    }

    /**
     * @returns {boolean} indicator whether current currency is cryptocurrency
     */
    protected get isCryptocurrency(): boolean {
        return _includes(
            this.cryptocurrenciesList,
            _toUpper(this.$params.currency).trim(),
        );
    }

    constructor(
        protected changeDetectorRef: ChangeDetectorRef,
        protected translateService: TranslateService,
        @Inject(CRYPTOCURRENCIES)
        protected cryptocurrencies: ICryptocurrencies,
        @Inject('injectParams')
        injectParams: Params.ICurrencyParams,
        configService: ConfigService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.getInlineParams());

        this.subscribeOnLanguageChange();
        this.setIndicatorFormat();
        this.setIntlCurrencyFormat(this.translateService.currentLang);
        this.processValue();
    }

    protected subscribeOnLanguageChange(): void {
        this.translateService.onLangChange
            .pipe(takeUntil(this.$destroy))
            .subscribe(({lang}) => {
                this.setIntlCurrencyFormat(lang);
                this.setDisplayValue();
                this.changeDetectorRef.markForCheck();
            });
    }

    protected getInlineParams(): Params.ICurrencyParams {
        const inline = {};
        _each(['value', 'currency', 'digitsInfo', 'indicatorFormat'], (key) => {
            if (this[key] !== undefined) {
                inline[key] = this[key];
            }
        });
        return Object.keys(inline).length ? inline : null;
    }

    /**
     * @description
     * Evaluates value once if it is a number.
     *
     * If it's a behavior subject it subscribes on it and reevaluates display value on each update.
     */
    protected processValue(): void {
        if (this.value instanceof BehaviorSubject) {
            this.value.pipe(
                takeUntil(this.$destroy),
            ).subscribe((nextValue) => {
                this.numericValue = _toNumber(nextValue) || 0;
                this.setDisplayValue();
                this.changeDetectorRef.markForCheck();
            });
        } else {
            this.numericValue = _toNumber(this.$params.value) || 0;
            this.setDisplayValue();
            this.changeDetectorRef.markForCheck();
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
            _split(this.$params.digitsInfo, '-'),
            _toInteger,
        );

        return {
            minimumIntegerDigits: putInRange(minimumIntegerDigits || 1, 1, 21),
            minimumFractionDigits: putInRange(minimumFractionDigits ?? 2, 0, allowFractionDigits),
            maximumFractionDigits: putInRange(maximumFractionDigits ?? 2, 0, allowFractionDigits),
        };
    }

    protected setIntlCurrencyFormat(lang: string): void {
        this.intlCurrencyFormat = Intl.NumberFormat(lang, {
            style: 'currency',
            // pass usd if this is cryptocurrency, otherwise Intl inserts literal
            currency: this.isCryptocurrency ? 'USD' : _toUpper(this.$params.currency).trim(),
            currencyDisplay: this.$params.indicatorFormat,
            useGrouping: true,
            ...this.getParsedDigitsInfo(2),
        });
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
            this.$params.indicatorFormat = _find<Params.IndicatorFormatType>(
                [this.$params.indicatorFormat, 'symbol', 'narrowSymbol', 'code', 'name'],
                (indicator) => !!this.currencyFormat[indicator],
            );
        } else {
            this.$params.indicatorFormat ||= 'symbol';
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
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Formats value according to ISO 4217
     */
    protected getIntlParts(): CurrencyPart[] {
        return this.intlCurrencyFormat.formatToParts(this.numericValue);
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

        const chars: readonly number[] = this.currencyFormat[this.$params.indicatorFormat];

        if (!chars) {
            return _toUpper(this.$params.currency).trim();
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
}
