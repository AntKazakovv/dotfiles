import {UntypedFormControl} from '@angular/forms';

import {IDatepickerCParams} from 'wlc-engine/modules/core/components/datepicker/datepicker.params';
import {ISelectCParams} from 'wlc-engine/modules/core/components/select/select.params';
import {
    TBonusFilter,
    TTournamentsFilter,
    TTransactionFilter,
} from 'wlc-engine/modules/history/system/interfaces/history-filter.interface';
import {ISelectOptions} from 'wlc-engine/modules/profile';

export const startDate: IDatepickerCParams = {
    name: 'startDate',
    label: gettext('Start date'),
    control: new UntypedFormControl(''),
    event: {
        emit: 'CHANGE_START_DATE',
        subscribe: 'CHANGE_END_DATE',
    },
};

export const endDate: IDatepickerCParams = {
    name: 'endDate',
    label: gettext('End date'),
    control: new UntypedFormControl(''),
    event: {
        emit: 'CHANGE_END_DATE',
        subscribe: 'CHANGE_START_DATE',
    },
};

export const refCommissionFilterConfig: ISelectOptions = {
    value: 'commission',
    title: gettext('Commission'),
};

export namespace transactionConfig {
    export const filterSelect: ISelectCParams<TTransactionFilter> = {
        name: 'filterValue',
        labelText: gettext('Sort by'),
        common: {
            placeholder: gettext('Type'),
        },
        control: new UntypedFormControl('all'),
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

    export const filterSelectTransfer: ISelectCParams<TTransactionFilter> = {
        name: 'filterValue',
        labelText: gettext('Sort by'),
        common: {
            placeholder: gettext('Type'),
        },
        control: new UntypedFormControl('all'),
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
            {
                value: 'transfer',
                title: gettext('Gift for a friend'),
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
        control: new UntypedFormControl('All'),
        options: 'merchants',
    };
    export const orderSelect: ISelectCParams = {
        name: 'orderDirection',
        theme: 'vertical',
        common: {
            customModifiers: 'order',
        },
        labelText: gettext('Order by'),
        control: new UntypedFormControl('desc'),
        items: [
            {
                value: 'desc',
                title: gettext('New first'),
            },
            {
                value: 'asc',
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
        control: new UntypedFormControl('all'),
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
    export const filterSelect: ISelectCParams<keyof typeof TBonusFilter> = {
        name: 'filterValue',
        common: {
            placeholder: gettext('Sort by'),
        },
        theme: 'vertical',
        labelText: gettext('Sort by'),
        control: new UntypedFormControl('all'),
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
                value: '90',
                title: gettext('Canceled (insufficient balance)'),
            },
            {
                value: '-102',
                title: gettext('Not used'),
            },
            {
                value: '-50',
                title: gettext('Canceled by administrator'),
            },
            {
                value: '-101',
                title: gettext('Unsubscribed'),
            },
            {
                value: '0',
                title: gettext('Subscribed'),
            },
            {
                value: '1',
                title: gettext('Activated'),
            },
            {
                value: '2',
                title: gettext('Inventoried'),
            },
        ],
    };
}
