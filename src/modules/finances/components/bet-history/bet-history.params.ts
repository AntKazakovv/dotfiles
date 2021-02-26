import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ITableCol} from 'wlc-engine/modules/core/components/table/table.params';
import {TransactionStatusComponent} from 'wlc-engine/modules/finances/components/transaction-history/transaction-status/transaction-status.component';
import {TransactionCancelComponent} from 'wlc-engine/modules/finances/components/transaction-history/transaction-cancel/transaction-cancel.component';
import {Transaction} from 'wlc-engine/modules/finances/system/models/transaction-history.model';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IBetHistoryCParams extends IComponentParams<Theme, Type, ThemeMod> {

}

export const defaultParams: IBetHistoryCParams = {
    class: 'wlc-transaction-history',
};

export const betHistoryTableHeadConfig: ITableCol[] = [
    {
        key: 'index',
        title: '#',
        type: 'index',
        order: 10,
        wlcElement: 'wlc-profile-table__cell_num',
    },
    {
        key: 'Date',
        title: 'Bet time',
        type: 'date',
        order: 20,
        wlcElement: 'wlc-profile-table__cell_time',
    },
    {
        key: 'Amount',
        title: 'Amount',
        type: 'amount',
        order: 30,
        wlcElement: 'wlc-profile-table__cell_amount',
    },
    {
        key: 'Merchant',
        title: 'Merchant',
        type: 'text',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_method',
    },
    {
        key: 'GameName',
        title: 'Game',
        type: 'text',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_method',
    },
];
