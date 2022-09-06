import {Injectable} from '@angular/core';
import {
    AbstractControl,
    FormControl,
} from '@angular/forms';

import {
    map,
    distinctUntilChanged,
    takeUntil,
    switchMap,
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
import _map from 'lodash-es/map';
import _range from 'lodash-es/range';
import _sortBy from 'lodash-es/sortBy';
import _uniqBy from 'lodash-es/uniqBy';
import _values from 'lodash-es/values';
import _merge from 'lodash-es/merge';
import _get from 'lodash-es/get';
import _cloneDeep from 'lodash-es/cloneDeep';
import _has from 'lodash-es/has';

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
import {ICurrency} from 'wlc-engine/modules/finances/system/interfaces/currencies.interface';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';

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
    public daysInMonth: BehaviorSubject<number> = new BehaviorSubject(31);
    public dayList: TConstantValue = this.getDateList('days');
    public countryStates$: BehaviorSubject<IState[]> =
        new BehaviorSubject<IState[]>([{value: '', title: 'Please select country'}]);

    protected configSelectWithIcon: Params.ISelectOptionsWithIcon;
    protected gamesCatalogService: GamesCatalogService;

    private constantValues: TConstantValues = {};
    private optionFunctions = new Map<string, () => TConstantValue>([
        ['currencies', () => this.prepareCurrency()],
        ['countries', () => this.configService.get<TConstantValue>('countries')],
        ['countryStates', () => this.configService.get<TConstantValue>('countryStates')],
        ['phoneCodes', () => this.getPhoneCodes()],
        ['genders', () => this.getGendersList()],
        ['birthDay', () => this.dayList],
        ['birthMonth', () => this.getDateList('months')],
        ['birthYear', () => this.getDateList('years')],
        ['pep', () => this.getPepList()],
        ['merchants', () => this.getMerchantsList()],
    ]);

    constructor(
        protected configService: ConfigService,
        private eventService: EventService,
        protected injectionService: InjectionService,
    ) {
        this.daysInMonth.subscribe(() => {
            this.dayList.next(this.getDateList('days').value);
        });

        if (this.configService.get('$modules.user.formElements.showIcon.use')) {
            this.prepareSelectWithIcon();
        }
    }

    /**
     * Prepares and returns currency objects
     *
     * @returns {TConstantValue} TConstantValue
     *
     */
    public prepareCurrency(): TConstantValue {
        const currencies = this.configService.get<IIndexing<string>>('$base.rewritingCurrencyName');
        const sortConfig = this.configService.get<string[]>('$base.registration.currencySort');
        let modifyCurrencies = _values(this.configService.get<IIndexing<ICurrency>>('appConfig.siteconfig.currencies'));

        modifyCurrencies = GlobalHelper.sortByOrder(modifyCurrencies, sortConfig, 'Name');

        return new BehaviorSubject(
            _map(
                _filter(modifyCurrencies, (el: ICurrency) => {
                    return el.registration;
                }), (el) => {
                    return {title: currencies[el.Name] || el.Name, value: el.Alias};
                }),
        );
    }

    /**
     * Returns a data list
     *
     * @param {TDateList} value days or months or years
     * @returns {BehaviorSubject<Params.ISelectOptions[]}
     */
    public getDateList(value: TDateList): TConstantValue {
        let list: Params.ISelectOptions[] = [];
        switch (value) {
            case 'days': {
                for (let day = 1; day <= this.daysInMonth.value; day++) {
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
        this.configService.get<BehaviorSubject<ICountry[]>>('countries')
            .pipe(map(data => {
                return _map(_sortBy(
                    _filter(
                        _uniqBy(data, (country) => country.phoneCode),
                        (country) => !!country.phoneCode,
                    ),
                    (country) => +country.phoneCode,
                ), (country: ICountry) => {
                    const countryData: Params.ISelectOptions = {
                        title: `+${country.phoneCode}`,
                        value: `+${country.phoneCode}`,
                    };

                    if (this.configSelectWithIcon?.components?.includes('phoneCode')) {
                        countryData.icon = this.getCountryFlag(country, true);
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
                value: 'true',
                title: gettext('Yes'),
            },
            {
                value: 'false',
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
                    const merchantsList = _sortBy(gamesCatalogService.getAvailableMerchants(), 'name')
                        .map((item): Params.ISelectOptions<string> => ({
                            title: item.name,
                            value: item.name,
                        }));
                    merchantsList.unshift({
                        title: gettext('All'),
                        value: 'all',
                    });

                    merchants$.next(merchantsList);
                });
            });

        return merchants$;
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
            iso = _get(this.configSelectWithIcon.isoByPhoneCode, `+${country.phoneCode}`, country.iso2);
        }

        return `/gstatic/wlc/flags/4x3/${iso}.svg`;
    }

    /**
     * The method prepare countries
     *
     * @param {ICountry[]} countries
     * @returns {ICountry[]}
     */
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
     * The method prepare config by select with icon
     *
     * @returns {void}
     */
    private prepareSelectWithIcon(): void {
        this.configSelectWithIcon = _cloneDeep(this.configService.get('$modules.user.formElements.showIcon'));

        if (this.configSelectWithIcon.components?.includes('phoneCode')) {
            this.configSelectWithIcon.isoByPhoneCode = _merge(
                {
                    '+7': 'ru',
                    '+1': 'ca',
                    '+44': 'im',
                    '+61': 'au',
                    '+212': 'ma',
                },
                this.configSelectWithIcon.isoByPhoneCode,
            );
        }
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
        stateControl: FormControl,
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
        control: FormControl,
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
}
