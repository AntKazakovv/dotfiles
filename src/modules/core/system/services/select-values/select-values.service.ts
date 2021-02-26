import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";
import {DateTime, Info} from "luxon";
import {ConfigService} from 'wlc-engine/modules/core/system/services';
import {ICountry, IIndexing} from "wlc-engine/modules/core";
import {ICurrency} from "wlc-engine/modules/finances/system/interfaces";

import * as Params from "wlc-engine/modules/core/components/select/select.params";

import {
    filter as _filter,
    map as _map,
    range as _range,
    sortBy as _sortBy,
    uniqBy as _uniqBy,
} from 'lodash-es';

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

    constructor(
        protected configService: ConfigService,
    )
    {
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
                list = _map(Info.months(), (month: string, index: number) => {
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
}
