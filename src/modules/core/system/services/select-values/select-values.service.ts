import {
    Injectable,
    Injector,
} from '@angular/core';
import {map} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {
    DateTime,
    Info,
} from 'luxon';
import {ConfigService, LayoutService} from 'wlc-engine/modules/core/system/services';
import {ICountry, IIndexing} from "wlc-engine/modules/core";
import {ICurrency} from 'wlc-engine/modules/finances/system/interfaces';
import {GamesCatalogService} from 'wlc-engine/modules/games';

import * as Params from 'wlc-engine/modules/core/components/select/select.params';

import _filter from 'lodash-es/filter';
import _map from 'lodash-es/map';
import _range from 'lodash-es/range';
import _sortBy from 'lodash-es/sortBy';
import _uniqBy from 'lodash-es/uniqBy';

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

    protected GamesCatalogService: GamesCatalogService;

    constructor(
        protected configService: ConfigService,
        protected layoutService: LayoutService,
        protected injector: Injector,
    ) {
        this.daysInMonth.subscribe(() => {
            this.dayList.next(this.getDateList('days').value);
        });
    }

    public prepareCurrency(): BehaviorSubject<Params.ISelectOptions[]> {
        const modifyCurrencies = this.configService.get<IIndexing<ICurrency>>('appConfig.siteconfig.currencies');
        return new BehaviorSubject(
            _map(
                _filter(modifyCurrencies, (el: ICurrency) => {
                    return el.registration;
                }), (el) => {
                    return {title: el.Name, value: el.Alias};
                }),
        );
    }

    public getDateList(value: string): BehaviorSubject<Params.ISelectOptions[]> {
        let list: Params.ISelectOptions[] = [];
        switch (value) {
            case 'days': {
                for (let day = 1; day < this.daysInMonth.value; day++) {
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

    public getPhoneCodes(): BehaviorSubject<Params.ISelectOptions[]> {
        let phoneCodes: Params.ISelectOptions[] = [];
        this.configService.get<BehaviorSubject<ICountry[]>>('countries')
            .pipe(map(data => {
                return _map(_sortBy(_filter(_uniqBy(data, (country) => country.phoneCode),
                    (country) => !!country.phoneCode), (country) => +country.phoneCode), (country) => {
                    return {
                        title: `+${+country.phoneCode}`,
                        value: `+${+country.phoneCode}`,
                        country: country.value,
                    };
                });
            })).subscribe(val => phoneCodes = val);

        return new BehaviorSubject<Params.ISelectOptions[]>(phoneCodes);
    }

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

    public getMerchantsList(): BehaviorSubject<Params.ISelectOptions[]> {
        const merchants$ = new BehaviorSubject<Params.ISelectOptions[]>([
            {
                title: gettext('All'),
                value: '',
            },
        ]);

        (async () => {
            await this.configService.ready;
            await this.layoutService.importModules(['games']);
            this.GamesCatalogService = this.injector.get(GamesCatalogService);
            await this.GamesCatalogService.ready;

            merchants$.next([
                {
                    title: gettext('All'),
                    value: '',
                },
            ].concat(_sortBy(this.GamesCatalogService?.getAvailableMerchants(), 'name')?.map(el => {
                return {
                    title: el.name,
                    value: el.name,
                };
            })));
        })();

        return merchants$;
    }
}
