import {FormControl} from '@angular/forms';
import {IAngularMyDpOptions, IMyDefaultMonth} from 'angular-mydatepicker';
import {DateTime} from 'luxon';
import {IMaskOptions} from 'wlc-engine/modules/core/directives/input-mask.directive';
import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IDatepickerCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    name: string;
    icon?: string;
    iconPath?: string;
    datepickerOptions?: IAngularMyDpOptions;
    maskOptions?: IMaskOptions;
    label?: string;
    control?: FormControl;
    defaultMonth?: IMyDefaultMonth;
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
    },
    maskOptions: {
        mask: Date,
        max: new Date(),
        lazy: false,
    },
};
