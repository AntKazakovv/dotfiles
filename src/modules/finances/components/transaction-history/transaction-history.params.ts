import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ITableCol} from 'wlc-engine/modules/core/components/table/table.params';
import {TransactionStatusComponent} from 'wlc-engine/modules/finances/components/transaction-history/transaction-status/transaction-status.component';
import {TransactionCancelComponent} from 'wlc-engine/modules/finances/components/transaction-history/transaction-cancel/transaction-cancel.component';
import {Transaction} from 'wlc-engine/modules/finances/system/models/transaction-history.model';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITransactionHistoryCParams extends IComponentParams<Theme, Type, ThemeMod> {
    filterType?: 'select' | 'button',
}

export const defaultParams: ITransactionHistoryCParams = {
    class: 'wlc-transaction-history',
    filterType: 'button',
};

export const transactionTableHeadConfig: ITableCol[] = [
    {
        key: 'index',
        title: '#',
        type: 'index',
        order: 10,
        wlcElement: 'transaction-history_cell_num',
    },
    {
        key: 'date',
        title: 'Transaction time',
        type: 'date',
        format: 'dd-MM-yyyy HH:mm:ss',
        order: 20,
        wlcElement: 'transaction-history_cell_time',
    },
    {
        key: 'amount',
        title: 'Amount',
        type: 'amount',
        disableHideClass: true,
        order: 30,
        wlcElement: 'transaction-history_cell_amount',
    },
    {
        key: 'status',
        title: 'Status',
        type: 'component',
        mapValue: (item: Transaction) => {return {transaction: item};},
        order: 40,
        componentClass: TransactionStatusComponent,
    },
    {
        key: 'system',
        title: 'Method',
        type: 'text',
        order: 50,
        wlcElement: 'transaction-history_cell_method',
    },
    {
        key: 'type',
        title: 'Type',
        type: 'component',
        mapValue: (item: Transaction) => {return {transaction: item};},
        componentClass: TransactionCancelComponent,
        order: 60,
        wlcElement: 'transaction-history_cell_type',
    },
];
