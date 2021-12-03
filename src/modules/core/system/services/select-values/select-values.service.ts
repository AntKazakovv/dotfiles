import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
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

import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {ICountry} from 'wlc-engine/modules/core/system/interfaces/fundist.interface';
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

@Injectable({
    providedIn: 'root',
})
export class SelectValuesService {
    public daysInMonth: BehaviorSubject<number> = new BehaviorSubject(31);
    public dayList: BehaviorSubject<Params.ISelectOptions[]> = this.getDateList('days');

    protected configSelectWithIcon: Params.ISelectOptionsWithIcon;
    protected gamesCatalogService: GamesCatalogService;

    constructor(
        protected configService: ConfigService,
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
     * @returns {BehaviorSubject<Params.ISelectOptions[]>} BehaviorSubject<Params.ISelectOptions[]>
     *
     */
    public prepareCurrency(): BehaviorSubject<Params.ISelectOptions[]> {
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
    public getDateList(value: TDateList): BehaviorSubject<Params.ISelectOptions[]> {
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
     * @returns {BehaviorSubject<Params.ISelectOptions[]>}
     */
    public getPhoneCodes(): BehaviorSubject<Params.ISelectOptions[]> {
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
     * @returns {BehaviorSubject<Params.ISelectOptions[]>}
     */
    public getPepList(): BehaviorSubject<Params.ISelectOptions[]> {
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
     * @returns {BehaviorSubject<Params.ISelectOptions[]}
     */
    public getMerchantsList(): BehaviorSubject<Params.ISelectOptions[]> {
        const merchants$ = new BehaviorSubject<Params.ISelectOptions[]>([
            {
                title: gettext('All'),
                value: '',
            },
        ]);

        (async () => {
            await this.configService.ready;
            this.gamesCatalogService =
                await this.injectionService.getService<GamesCatalogService>('games.games-catalog-service');
            await this.gamesCatalogService.ready;

            merchants$.next([
                {
                    title: gettext('All'),
                    value: '',
                },
            ].concat(_sortBy(this.gamesCatalogService?.getAvailableMerchants(), 'name')?.map(el => {
                return {
                    title: el.name,
                    value: el.name,
                };
            })));
        })();

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
}
