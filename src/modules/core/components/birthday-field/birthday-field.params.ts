import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ISelectCParams} from 'wlc-engine/modules/core/components/select/select.params';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IBirthFields {
    birthDay: ISelectCParams;
    birthMonth: ISelectCParams;
    birthYear: ISelectCParams;
}

export interface IBirthFieldCParams extends IComponentParams<ComponentTheme, ComponentType, string>, IBirthFields {}

export interface IFieldsValue {
    /**
     * names of controls
     */
    field: keyof IBirthFields;
    /**
     * controls value type
     */
    value: string;
}

export const defaultParams: Partial<IBirthFieldCParams> = {
    class: 'wlc-birth-field',
    birthDay: {
        labelText: gettext('Date of birth'),
        wlcElement: 'block_day',
        customMod: 'day',
        common: {
            placeholder: gettext('Day'),
        },
        locked: true,
        name: 'birthDay',
        validators: ['required'],
        options: 'birthDay',
    },
    birthMonth: {
        wlcElement: 'block_month',
        customMod: 'month',
        common: {
            placeholder: gettext('Month'),
        },
        locked: true,
        name: 'birthMonth',
        validators: ['required'],
        options: 'birthMonth',
    },
    birthYear: {
        wlcElement: 'block_year',
        customMod: 'year',
        common: {
            placeholder: gettext('Year'),
        },
        locked: true,
        name: 'birthYear',
        validators: ['required'],
        options: 'birthYear',
    },
};
