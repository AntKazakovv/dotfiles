import {FormControl} from '@angular/forms';

import {IDatepickerCParams} from 'wlc-engine/modules/core/components/datepicker/datepicker.params';
import {IRadioButtonsCParams} from 'wlc-engine/modules/core/components/radio-buttons/radio-buttons.params';
import {ISelectCParams} from 'wlc-engine/modules/core/components/select/select.params';
import {
    TBonusFilter,
    TTournamentsFilter,
    TTransactionFilter,
} from 'wlc-engine/modules/core/system/interfaces/history-filter.interface';
import {SortDirection} from 'wlc-engine/modules/core/system/interfaces/global.interface';

export const startDate: IDatepickerCParams = {
    name: 'startDate',
    label: gettext('Start date'),
    control: new FormControl(''),
    event: {
        emit: 'CHANGE_START_DATE',
        subscribe: 'CHANGE_END_DATE',
    },
};

export const endDate: IDatepickerCParams = {
    name: 'endDate',
    label: gettext('End date'),
    control: new FormControl(''),
    event: {
        emit: 'CHANGE_END_DATE',
        subscribe: 'CHANGE_START_DATE',
    },
};

export namespace transactionConfig {
    export const filterSelect: ISelectCParams<TTransactionFilter> = {
        name: 'filterValue',
        labelText: gettext('Sort by'),
        common: {
            placeholder: gettext('Type'),
        },
        control: new FormControl('all'),
        items: [
            {
                value: 'all',
                title: gettext('All'),
            },
            {
                value: 'deposit',
                title: gettext('Deposit'),
            },
            {
                value: 'withdraw',
                title: gettext('Withdrawal'),
            },
        ],
    };

    export const filterRadioBtn: IRadioButtonsCParams<TTransactionFilter> = {
        name: 'filterValue',
        common: {
            placeholder: gettext('Sort by'),
        },
        control: new FormControl('all'),
        items: [
            {
                value: 'all',
                title: gettext('All'),
            },
            {
                value: 'deposit',
                title: gettext('Deposit'),
            },
            {
                value: 'withdraw',
                title: gettext('Withdrawal'),
            },
        ],
    };
}

export namespace betConfig {
    export const filterSelect: ISelectCParams = {
        name: 'filterValue',
        theme: 'vertical',
        common: {
            placeholder: gettext('All'),
        },
        labelText: gettext('Providers'),
        control: new FormControl('All'),
        options: 'merchants',
    };
    export const orderSelect: ISelectCParams = {
        name: 'orderValue',
        theme: 'vertical',
        common: {
            customModifiers: 'order',
        },
        labelText: gettext('Order by'),
        control: new FormControl(SortDirection.NewFirst),
        items: [
            {
                value: SortDirection.NewFirst,
                title: gettext('New first'),
            },
            {
                value: SortDirection.OldFirst,
                title: gettext('Old first'),
            },
        ],
    };
}

export namespace tournamentConfig {
    export const filterSelect: ISelectCParams<TTournamentsFilter> = {
        name: 'filterValue',
        common: {
            placeholder: gettext('Sort by'),
        },
        theme: 'vertical',
        labelText: gettext('Sort by'),
        control: new FormControl('all'),
        items: [
            {
                value: 'all',
                title: gettext('All'),
            },
            {
                value: '0',
                title: gettext('Selected'),
            },
            {
                value: '1',
                title: gettext('Qualified'),
            },
            {
                value: '-95',
                title: gettext('Deactivated'),
            },
            {
                value: '-99',
                title: gettext('Canceled'),
            },
            {
                value: '99',
                title: gettext('Ending'),
            },
            {
                value: '100',
                title: gettext('Ended'),
            },
        ],
    };
}

export namespace bonusesConfig {
    export const filterSelect: ISelectCParams<TBonusFilter> = {
        name: 'filterValue',
        common: {
            placeholder: gettext('Sort by'),
        },
        theme: 'vertical',
        labelText: gettext('Sort by'),
        control: new FormControl('all'),
        items: [
            {
                value: 'all',
                title: gettext('All'),
            },
            {
                value: '-100',
                title: gettext('Expired'),
            },
            {
                value: '-99',
                title: gettext('Canceled'),
            },
            {
                value: '100',
                title: gettext('Wagered'),
            },
        ],
    };
}
