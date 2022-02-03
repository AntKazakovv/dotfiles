import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnChanges,
    OnInit,
    Optional,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
    BehaviorSubject,
    combineLatest,
    of,
} from 'rxjs';
import {
    filter,
    map,
    startWith,
    takeUntil,
} from 'rxjs/operators';

import {
    ConfigService,
    AbstractComponent,
} from 'wlc-engine/modules/core';
import {CurrencyModel, ICurrencyIcon} from 'wlc-engine/modules/core/system/models/currency.model';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';

import * as Params from './currency.params';

import _filter from 'lodash-es/filter';
import _each from 'lodash-es/each';
import _keys from 'lodash-es/keys';
import _join from 'lodash-es/join';
import _map from 'lodash-es/map';
import _isNil from 'lodash-es/isNil';
import _isNaN from 'lodash-es/isNaN';

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

    @Input() public showIconOnly: boolean;

    @Input() public showValueOnly: boolean;

    @Input() public hideSvgName: boolean;

    @Input() public svgPosition: 'left' | 'right';

    /**
     * Result that would be displayed
     */
    public displayValue: string;

    /**
     * Object that template will take as a guidance in case currency symbol displays as an icon.
     *
     * - `iconChar`: char for an icon;
     * - `placement`: where it should be placed, on the left side of the value or the right side;
     * - `minusBeforeCurrency`: whether should minus sign be placed before icon if the value is negative
     * and the currency icon is on the left side.
     */
    public icon: ICurrencyIcon;
    public $params: Params.ICurrencyCParams;
    public loaded: boolean = false;
    public isNegative: boolean = false;
    public showName: boolean = false;
    public showSvg: boolean = false;
    public isError: boolean = false;
    protected $init: boolean = false;
    protected language: string = this.translateService.currentLang;

    constructor(
        protected changeDetectorRef: ChangeDetectorRef,
        protected translateService: TranslateService,
        protected configService: ConfigService,
        @Optional()
        @Inject('injectParams')
        protected injectParams: Params.ICurrencyCParams,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public ngOnChanges(): void {
        if (this.$init) {
            this.updateParams();
            this.updateModel();
        }
    }

    public ngOnInit(): void {
        super.ngOnInit(this.getInlineParams());
        this.loaded = !!this.$params.currency;

        const languageObservable = this.translateService.onLangChange.pipe(
            map((event) => event.lang),
            startWith(this.translateService.currentLang),
        );

        const userProfile$ = this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'});

        const currencyObservable = this.$params.currency
            ? of(this.$params.currency)
            : userProfile$.pipe(
                filter((profile) => !!profile),
                map((profile) => profile.currency),
            );

        const valueObservable = this.value instanceof BehaviorSubject
            ? this.value
            : of(this.$params.value);

        combineLatest([
            languageObservable,
            currencyObservable,
            valueObservable,
        ])
            .pipe(takeUntil(this.$destroy))
            .subscribe(([language, currency, value]) => {
                this.language = language;
                this.loaded = true;

                this.updateParams({
                    value,
                    currency,
                });

                this.updateModel();
                this.showName = this.$params?.useSvgIconName && !this.icon.iconChar && !this.hideSvgName;
                this.showSvg = !this.showValueOnly && this.icon?.svg && !this.$params?.useSvgIconName;
                this.changeDetectorRef.markForCheck();
            });

        this.$init = true;
    }

    protected updateParams(currentParams: Params.ICurrencyCParams = null): void {
        this.$params = {
            ...this.$params,
            ...currentParams,
            ...this.injectParams,
            ...this.getInlineParams(),
        };
    }

    protected updateModel(): void {
        this.isError = false;

        const model = new CurrencyModel(
            {
                component: 'CurrencyComponent',
                method: 'updateModel',
            },
            this.$params.value,
            {
                language: this.language,
                currency: this.$params.currency || this.configService.get<string>('$base.defaultCurrency'),
                digitsInfo: this.$params.digitsInfo,
                svgPosition: this.svgPosition || 'right',
            },
        );

        this.isNegative = model.numericValue < 0;
        let currencyParts = [...model.currencyParts];

        if (model.icon) {
            currencyParts = _filter(model.currencyParts,
                (part) => part.type !== 'currency' && part.type !== 'minusSign',
            );
            this.icon = model.icon;
        } else {
            this.icon = null;
        }

        if (this.$params.showIconOnly) {
            currencyParts = _filter(currencyParts, (part) => part.type === 'currency');
        } else if (this.$params.showValueOnly) {
            currencyParts = _filter(currencyParts, (part) => part.type !== 'currency');
        }

        this.displayValue = _join(_map(currencyParts, (part) => part.value), '').trim();
        if (_isNil(this.$params.value) || _isNaN(this.$params.value)) {
            this.addModifiers('is-error');
            this.isError = true;
        } else if (this.$params.value > 0) {
            this.addModifiers('above-zero');
        } else if (this.$params.value < 0) {
            this.addModifiers('less-zero');
        }
    }

    protected getInlineParams(): Params.ICurrencyCParams {
        const inline = {};
        _each(['value', 'currency', 'digitsInfo', 'showIconOnly', 'showValueOnly'], (key) => {
            if (this[key] !== undefined) {
                inline[key] = this[key];
            }
        });
        return _keys(inline).length ? inline : null;
    }
}
