import {FormControl} from '@angular/forms';
import {IAngularMyDpOptions, IMyDefaultMonth} from 'angular-mydatepicker';
import {DateTime} from 'luxon';
import {IMaskOptions} from 'wlc-engine/modules/core/directives/input-mask.directive';
import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type TDatepickerEvent = 'CHANGE_START_DATE' | 'CHANGE_END_DATE';

export interface IDatepickerCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    name: string;
    icon?: string;
    iconPath?: string;
    datepickerOptions?: IAngularMyDpOptions;
    maskOptions?: IMaskOptions;
    label?: string;
    control?: FormControl;
    defaultMonth?: IMyDefaultMonth;
    event?: {
        emit?: TDatepickerEvent,
        subscribe?: TDatepickerEvent,
    }
}

const tomorrow = DateTime.local().plus({days: 1});

export const defaultParams: Partial<IDatepickerCParams> = {
    class: 'wlc-datepicker',
    iconPath: 'wlc/icons/calendar.svg',
    datepickerOptions: {
        dateFormat: 'dd.mm.yyyy',
        disableSince: {
            year: tomorrow.year,
            month: tomorrow.month,
            day: tomorrow.day,
        },
        selectorWidth: '260px',
        selectorHeight: '277px',
    },
    maskOptions: {
        mask: Date,
        max: new Date(),
        lazy: false,
    },
};
