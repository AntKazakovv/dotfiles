import {UntypedFormControl} from '@angular/forms';

import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type TDatepickerEvent = 'CHANGE_START_DATE' | 'CHANGE_END_DATE';

export interface ILocale {
    name: string;
    config: string;
}

export interface IDatepickerCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    name: string;
    icon?: string;
    iconPath?: string;
    datepickerOptions?: Partial<BsDatepickerConfig>;
    maskOptions?: IMask.AnyMaskedOptions;
    label?: string;
    control?: UntypedFormControl;
    locales?: IIndexing<ILocale>;
    useEmptyValue?: boolean;
    event?: {
        emit?: TDatepickerEvent,
        subscribe?: TDatepickerEvent,
    },
}

export const defaultParams: Partial<IDatepickerCParams> = {
    class: 'wlc-datepicker',
    moduleName: 'core',
    componentName: 'wlc-datepicker',
    iconPath: 'wlc/icons/calendar.svg',
    datepickerOptions: {
        dateInputFormat: 'DD.MM.YYYY',
        showWeekNumbers: false,
        customTodayClass: 'today',
        maxDate: new Date(),
        monthTitle: 'MMM',
        monthLabel: 'MMM',
        selectFromOtherMonth: true,
        keepDatesOutOfRules: true,
        adaptivePosition: true,
    },
    maskOptions: {
        mask: Date,
        max: new Date(),
        lazy: false,
    },
    locales: {
        'ar': {name: 'ar', config: 'arLocale'},
        'bg': {name: 'bg', config: 'bgLocale'},
        'ca': {name: 'ca', config: 'caLocale'},
        'cs': {name: 'cs', config: 'csLocale'},
        'da': {name: 'da', config: 'daLocale'},
        'de': {name: 'de', config: 'deLocale'},
        'es': {name: 'es', config: 'esLocale'},
        'fi': {name: 'fi', config: 'fiLocale'},
        'fr': {name: 'fr', config: 'frLocale'},
        'he': {name: 'he', config: 'heLocale'},
        'hi': {name: 'hi', config: 'hiLocale'},
        'hu': {name: 'hu', config: 'huLocale'},
        'hr': {name: 'hr', config: 'hrLocale'},
        'id': {name: 'id', config: 'idLocale'},
        'it': {name: 'it', config: 'itLocale'},
        'ja': {name: 'ja', config: 'jaLocale'},
        'ka': {name: 'ka', config: 'kaLocale'},
        'kk': {name: 'kk', config: 'kkLocale'},
        'ko': {name: 'ko', config: 'koLocale'},
        'mn': {name: 'mn', config: 'mnLocale'},
        'no': {name: 'nb', config: 'nbLocale'},
        'nl': {name: 'nl', config: 'nlLocale'},
        'pl': {name: 'pl', config: 'plLocale'},
        'pt-br': {name: 'pt-br', config: 'ptBrLocale'},
        'ro': {name: 'ro', config: 'roLocale'},
        'ru': {name: 'ru', config: 'ruLocale'},
        'sk': {name: 'sk', config: 'skLocale'},
        'sl': {name: 'sl', config: 'slLocale'},
        'sq': {name: 'sq', config: 'sqLocale'},
        'sv': {name: 'sv', config: 'svLocale'},
        'th': {name: 'th', config: 'thLocale'},
        'tr': {name: 'tr', config: 'trLocale'},
        'ua': {name: 'uk', config: 'ukLocale'},
        'vi': {name: 'vi', config: 'viLocale'},
        'zh-cn': {name: 'zh-cn', config: 'zhCnLocale'},
        'en': {name: 'en-gb', config: 'enGbLocale'},
    },
};
