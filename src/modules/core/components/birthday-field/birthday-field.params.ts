import {IBirthFieldCParams} from 'wlc-engine/modules/core/components/birthday-field/birthday-field.interfaces';

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
