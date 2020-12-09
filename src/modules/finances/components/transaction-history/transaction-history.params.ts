import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ITableCol} from 'wlc-engine/modules/core/components/table/table.params';
import {TransactionStatusComponent} from 'wlc-engine/modules/finances/components/transaction-status/transaction-status.component';
import {TransactionCancelComponent} from 'wlc-engine/modules/finances/components/transaction-cancel/transaction-cancel.component';
import {Transaction} from 'wlc-engine/modules/finances/system/models/transaction-history.model';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITransactionHistoryParams extends IComponentParams<Theme, Type, ThemeMod> {
    filterType?: 'select' | 'button',
}

export const defaultParams: ITransactionHistoryParams = {
    class: 'wlc-transaction-history',
    filterType: 'button',
};

export const transactionTableHeadConfig: ITableCol[] = [
    {
        key: 'index',
        title: '#',
        type: 'index',
        order: 10,
    },
    {
        key: 'date',
        title: 'Transaction time',
        type: 'date',
        format: 'dd-MM-yyyy HH:mm:ss',
        order: 20,
    },
    {
        key: 'amount',
        title: 'Amount',
        type: 'amount',
        disableHideClass: true,
        order: 30,
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
    },
    {
        key: 'type',
        title: 'Type',
        type: 'component',
        mapValue: (item: Transaction) => {return {transaction: item};},
        componentClass: TransactionCancelComponent,
        order: 60,
    },
];
