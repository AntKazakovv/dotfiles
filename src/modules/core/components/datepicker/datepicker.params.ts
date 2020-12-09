import {FormControl} from '@angular/forms';
import {IAngularMyDpOptions} from 'angular-mydatepicker';
import {DateTime} from 'luxon';
import {CustomType, IComponentParams} from 'wlc-engine/classes/abstract.component';
import {IMaskOptions} from 'wlc-engine/modules/core/directives/input-mask.directive';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IDatepickerCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    name: string;
    icon?: string;
    datepickerOptions?: IAngularMyDpOptions;
    maskOptions?: IMaskOptions;
    label?: string;
    control?: FormControl;
}

const now = DateTime.local();

export const defaultParams: Partial<IDatepickerCParams> = {
    class: 'wlc-datepicker',
    icon: 'calendar',
    datepickerOptions: {
        dateFormat: 'dd.mm.yyyy',
        disableSince: {
            year: now.year,
            month: now.month,
            day: now.day + 1,
        },
    },
    maskOptions: {
        mask: Date,
        max: new Date(),
        lazy: false,
    },
};
