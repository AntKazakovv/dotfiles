import {Injectable} from '@angular/core';
import {
    AbstractControl,
    UntypedFormControl,
} from '@angular/forms';

import {
    map,
    distinctUntilChanged,
    takeUntil,
    switchMap,
    tap,
} from 'rxjs/operators';
import {
    Subject,
    BehaviorSubject,
    from,
} from 'rxjs';
import {
    DateTime,
    Info,
} from 'luxon';

import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';
import _map from 'lodash-es/map';
import _range from 'lodash-es/range';
import _sortBy from 'lodash-es/sortBy';
import _uniqBy from 'lodash-es/uniqBy';
import _values from 'lodash-es/values';
import _merge from 'lodash-es/merge';
import _get from 'lodash-es/get';
import _cloneDeep from 'lodash-es/cloneDeep';
import _has from 'lodash-es/has';
import _includes from 'lodash-es/includes';

import {UserProfile} from 'wlc-engine/modules/user';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {
    ICountry,
    TStates,
    IState,
} from 'wlc-engine/modules/core/system/interfaces/fundist.interface';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {CustomHook} from 'wlc-engine/modules/core/system/decorators/hook.decorator';
import {CurrencyService} from 'wlc-engine/modules/currency/system/services/currency.service';
import {ICurrencyModel} from 'wlc-engine/modules/currency/system/interfaces/currency.interface';

import * as Params from 'wlc-engine/modules/core/components/select/select.params';

export type TDateList = 'days' | 'months' | 'years';

export interface IPhoneLimits {
    [key: string]: {
        minLength?: number;
        maxLength?: number;
    };
}

type TConstantValue = BehaviorSubject<Params.ISelectOptions[]>;
type TConstantValues = IIndexing<TConstantValue>;

@Injectable({
    providedIn: 'root',
})
export class SelectValuesService {
    public dayList: BehaviorSubject<Params.ISelectOptions[]> = new BehaviorSubject([]);
    public countryStates$: BehaviorSubject<IState[]> = new BehaviorSubject([{
        value: '',
        title: 'Please select country',
    }]);

    protected merchantsList: TConstantValue = null;
    protected configSelectWithIcon: Params.ISelectOptionsWithIcon;
    protected gamesCatalogService: GamesCatalogService;
    protected isoByPhoneCode: IIndexing<string>;

    private constantValues: TConstantValues = {};
    private optionFunctions = new Map<string, () => TConstantValue>([
        ['currencies', (): TConstantValue => this.prepareCurrency()],
        ['countries', (): TConstantValue => this.configService.get<TConstantValue>('countries')],
        ['countryStates', (): TConstantValue => this.configService.get<TConstantValue>('countryStates')],
        ['phoneCodes', (): TConstantValue => this.getPhoneCodes()],
        ['genders', (): TConstantValue => this.getGendersList()],
        ['birthDay', (): BehaviorSubject<Params.ISelectOptions[]> => this.dayList],
        ['birthMonth', (): TConstantValue => this.getDateList('months')],
        ['birthYear', (): TConstantValue => this.getDateList('years')],
        ['pep', (): TConstantValue => this.getPepList()],
        ['merchants', (): TConstantValue => this.getMerchantsList()],
        ['logoutTime', (): TConstantValue => this.getLogoutTime()],
    ]);
    private _daysInMonth: BehaviorSubject<number> = new BehaviorSubject(31);
    private currencyService: CurrencyService;

    constructor(
        protected configService: ConfigService,
        protected eventService: EventService,
        protected injectionService: InjectionService,
    ) {
        this.init();
    }

    public get daysInMonth(): number {
        return this._daysInMonth.getValue();
    }

    private async init(): Promise<void> {
        await this.configService.ready;
        this.currencyService = await this.injectionService.getService<CurrencyService>('currency.currency-service');
        this._daysInMonth.subscribe(() => {
            this.dayList.next(this.getDateList('days').value);
        });

        if (this.configService.get('$base.forms.formElements.showIcon.use')
            || this.configService.get('$base.forms.formElements.showCountryNamesForPhoneCodes')
        ) {
            this.prepareSelectConfig();
        }
    }

    /**
     * Prepares and returns currency objects
     *
     * @returns {TConstantValue} TConstantValue
     *this.configService.get<string>('appConfig.country')
     */
    public prepareCurrency(): TConstantValue {
        if (this.configService.get<IIndexing<ICurrencyModel>>('$base.registration.regCurrenciesByCountries' &&
            '$base.registration.filterCurrencyByGeo')) {
            return this.filterCurrency(this.configService.get<string>('appConfig.country'));
        } else {
            return this.filterCurrency();
        }
    }

    public filterCurrency(country?: string): TConstantValue {
        const currencies = this.configService.get<IIndexing<string>>('$base.rewritingCurrencyName');
        const sortConfig = this.configService.get<string[]>('$base.registration.currencySort');
        let modifyCurrencies: ICurrencyModel[] = _values(this.currencyService.regCurrencies);

        modifyCurrencies = GlobalHelper.sortByOrder(modifyCurrencies, sortConfig, 'DisplayName');

        if (country) {
            const currenciesByCountry = this.configService.get<string>(
                `$base.registration.regCurrenciesByCountries.${country}`,
            );

            if (currenciesByCountry) {
                modifyCurrencies = _filter(modifyCurrencies, (el) => {
                    return _includes(currenciesByCountry, el.Name);
                });
            }
        }

        return new BehaviorSubject(
            _map(modifyCurrencies, (el) => {
                return {title: currencies[el.DisplayName] || el.DisplayName, value: el.Alias};
            }),
        );
    }

    /**
     * Returns a data list
     *
     * @param {TDateList} value days or months or years
     * @returns {BehaviorSubject<Params.ISelectOptions[]>}
     */
    @CustomHook('core', 'selectValuesDateList')
    public getDateList(value: TDateList): TConstantValue {
        let list: Params.ISelectOptions[] = [];
        switch (value) {
            case 'days': {
                for (let day = 1; day <= this._daysInMonth.value; day++) {
                    list.push({title: day, value: `${day}`});
                }
                break;
            }
            case 'months': {
                list = _map(Info.months('long', {locale: 'en'}), (month: string, index: number) => {
                    return {title: month, value: `${++index}`};
                });
                break;
            }

            case 'years': {
                list = _map(_range(DateTime.local().year - 18, 1900), (year) => {
                    return {title: `${year}`, value: `${year}`};
                });
                break;
            }
        }

        return new BehaviorSubject<Params.ISelectOptions[]>(list);
    };

    /**
     * Returns a list of phone codes
     *
     * @returns {TConstantValue}
     */
    public getPhoneCodes(): TConstantValue {
        const phoneCodes = new BehaviorSubject<Params.ISelectOptions[]>([]);
        const showIcon = this.configSelectWithIcon?.components?.includes('phoneCode');
        const showCountryNames = this.configService.get<boolean>(
            '$base.forms.formElements.showCountryNamesForPhoneCodes',
        );
        let countries: ICountry[] = [];

        this.configService.get<BehaviorSubject<ICountry[]>>('countries')
            .pipe(
                tap(data => countries = data),
                map(data => {
                    return _map(_sortBy(
                        _filter(
                            _uniqBy(data, (country: ICountry) => country.phoneCode),
                            (country) => !!country.phoneCode,
                        ),
                        (country) => +country.phoneCode,
                    ), (country: ICountry) => {
                        const countryData: Params.ISelectOptions<string> = {
                            title: `+${country.phoneCode}`,
                            value: `+${country.phoneCode}`,
                        };

                        if (showIcon) {
                            countryData.icon = this.getCountryFlag(country, true);
                        }

                        if (showCountryNames) {
                            countryData.note = this.getCountryName(countries, country);
                        }

                        return countryData;
                    });
                })).subscribe(val => phoneCodes.next(val));

        return phoneCodes;
    }

    /**
     * Returns a list of pep
     *
     * @returns {TConstantValue}
     */
    public getPepList(): TConstantValue {
        return new BehaviorSubject<Params.ISelectOptions[]>([
            {
                value: true,
                title: gettext('Yes'),
            },
            {
                value: false,
                title: gettext('No'),
            }]);
    }

    /**
     * Returns a phone limits default
     *
     * @returns {IPhoneLimits}
     */
    public getPhoneLimitsDefault(): IPhoneLimits {
        return {
            'default': {
                minLength: 6,
                maxLength: 13,
            },
            '+1': {
                minLength: 10,
            },
            '+7': {
                minLength: 10,
                maxLength: 11,
            },
            '+45': {
                minLength: 8,
            },
            '+46': {
                minLength: 8,
                maxLength: 10,
            },
            '+47': {
                minLength: 8,
                maxLength: 9,
            },
            '+49': {
                minLength: 10,
                maxLength: 11,
            },
            '+61': {
                minLength: 9,
                maxLength: 10,
            },
            '+64': {
                minLength: 9,
                maxLength: 10,
            },
            '+91': {
                maxLength: 10,
            },
            '+358': {
                minLength: 8,
                maxLength: 9,
            },
            '+375': {
                minLength: 9,
            },
            '+380': {
                minLength: 9,
            },
            '+386': {
                minLength: 8,
                maxLength: 9,
            },
            '+420': {
                minLength: 9,
            },
            '+421': {
                minLength: 9,
            },
        };
    }

    /**
     * Returns a merchants list
     *
     * @returns {TConstantValue}
     */
    public getMerchantsList(): TConstantValue {
        if (this.merchantsList) {
            return this.merchantsList;
        }

        const merchants$ = new BehaviorSubject<Params.ISelectOptions[]>([
            {
                title: gettext('All'),
                value: 'all',
            },
        ]);

        from(this.configService.ready)
            .pipe(
                switchMap(() =>
                    from(this.injectionService.getService<GamesCatalogService>('games.games-catalog-service')),
                ),
            )
            .subscribe((gamesCatalogService) => {
                gamesCatalogService.ready.then(() => {
                    const merchantsList: Params.ISelectOptions<string>[] = _sortBy(
                        gamesCatalogService.getAvailableMerchants(),
                        'alias',
                    ).map((item): Params.ISelectOptions<string> => ({
                        title: item.alias,
                        value: item.alias,
                    }));

                    merchantsList.unshift({
                        title: gettext('All'),
                        value: 'all',
                    });

                    merchants$.next(merchantsList);
                });
            });

        return this.merchantsList = merchants$;
    }

    /**
     * The method return url by country flag
     *
     * @param {ICountry} country
     * @param {boolean} phoneCode - should be check iso config by phone code
     * @returns {string} path by country flag
     */
    public getCountryFlag(country: ICountry, phoneCode?: boolean): string {
        let iso = country.iso2;

        if (phoneCode) {
            iso = _get(this.isoByPhoneCode, `+${country.phoneCode}`, country.iso2);
        }

        return `${GlobalHelper.gstaticUrl}/wlc/flags/4x3/${iso}.svg`;
    }

    /**
     * The method return country name check custom settings by iso2
     *
     * @param {ICountry[]} countries
     * @param {ICountry} country - current checked country
     * @returns {string} country name
     */
    private getCountryName(countries: ICountry[], country: ICountry): string {
        const val: string | undefined = _get(
            this.isoByPhoneCode,
            `+${country.phoneCode}`,
        );

        if (val) {
            return _find(countries, (v) => v.iso2 === val)?.title || country.title;
        }

        return country.title;
    }

    /**
     * The method prepare countries
     *
     * @param {ICountry[]} countries
     * @returns {ICountry[]}
     */
    @CustomHook('core', 'selectValuesPrepareCountries')
    public prepareCountries(countries: ICountry[]): ICountry[] {
        let countryList = countries;

        if (this.configSelectWithIcon?.components?.includes('countryCode')) {
            countryList = _map(countries, (country: ICountry) => {
                country.icon = this.getCountryFlag(country);
                return country;
            });
        }

        return _sortBy(countryList, 'title');
    }

    /**
     * A method that subscribes to changing the country field and returns the states of the corresponding country
     *
     * @method getCountryStates
     * @param {FormControl} control
     * @param {Subject<void>} $destroy
     * @returns {TConstantValue}
     */
    public getCountryStates(
        stateControl: UntypedFormControl,
        destroy: Subject<void>,
    ): TConstantValue {

        (async () => {
            await this.configService.ready;
            const countriesStates: TStates =
                this.configService.get<BehaviorSubject<TStates>>('states')?.getValue();
            const countryCodeControl: AbstractControl = stateControl.root?.get('countryCode');

            if (countryCodeControl) {
                countryCodeControl.valueChanges
                    .pipe(
                        distinctUntilChanged(),
                        takeUntil(destroy),
                    )
                    .subscribe((countryCode: string) => {
                        this.eventService.emit({
                            name: 'COUNTRY_STATES',
                        });
                        if (_has(countriesStates, countryCode)) {
                            this.countryStates$.next(countriesStates[countryCode]);
                            stateControl.enable();
                            return;
                        }
                        this.countryStates$.next([{value: '', title: 'Country without states'}]);
                        stateControl.disable();
                    });
            } else {
                const country: string = this.configService
                    .get<BehaviorSubject<UserProfile>>('$user.userProfile$').getValue()['countryCode'];
                this.countryStates$.next(countriesStates[country]);
            }
        })();
        return this.countryStates$;
    }

    /**
     * Gives gender variants
     *
     * @returns {TConstantValue} Observable list of gender options
     */
    public getGendersList(): TConstantValue {
        return new BehaviorSubject([
            {
                value: '',
                title: gettext('Not selected'),
            },
            {
                value: 'f',
                title: gettext('Female'),
            },
            {
                value: 'm',
                title: gettext('Male'),
            },
        ]);
    }

    /**
     * The method get constant values from configService and selectValues by select fields names
     *
     * @method prepareConstantValues
     * @param {string} option - selector options
     * @param {FormControl} control - select formControl
     * @returns {TConstantValues} - Map of constant values
     */
    public prepareConstantValues(
        option: string,
        control: UntypedFormControl,
        destroy: Subject<void>,
    ): TConstantValues {

        if (option === 'states') {
            this.optionFunctions.set('states', () => this.getCountryStates(control, destroy));
        }

        if (this.optionFunctions.has(option)) {
            this.constantValues[option] = this.optionFunctions.get(option)();
        }

        return this.constantValues;
    }

    /**
     * Sets days in month to default 31
     */
    public setDaysInMonth(data: number): void {
        this._daysInMonth.next(data);
    }

    private getLogoutTime(): TConstantValue {
        return new BehaviorSubject(
            this.configService.get<number[]>('$base.profile.autoLogout.timeList').map((time) => {
                return {
                    title: gettext('{{time}} min'),
                    context: {
                        time: time.toString(),
                    },
                    value: time,
                };
            }));
    }

    /**
     * The method prepare config by select with icon and country name
     *
     * @returns {void}
     */
    private prepareSelectConfig(): void {
        if (this.configService.get<boolean>('$base.forms.formElements.showIcon.use')) {
            this.configSelectWithIcon = _cloneDeep(
                this.configService.get<Params.ISelectOptionsWithIcon>('$base.forms.formElements.showIcon'),
            );
        }

        this.isoByPhoneCode = _merge(
            {
                '+7': 'ru',
                '+1': 'ca',
                '+44': 'im',
                '+61': 'au',
                '+212': 'ma',
            },
            this.configService.get<IIndexing<string>>('$base.forms.formElements.isoByPhoneCode'),
        );
    }

}
