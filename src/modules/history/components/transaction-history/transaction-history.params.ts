import {
    IComponentParams,
    CustomType,
    IWrapperCParams,
    ITableCol,
    ITableCParams,
} from 'wlc-engine/modules/core';
import {
    TransactionStatusComponent,
} from 'wlc-engine/modules/history/components/transaction-history/transaction-status/transaction-status.component';
import {
    TransactionButtonsComponent,
} from 'wlc-engine/modules/history/components/transaction-history/transaction-buttons/transaction-buttons.component';
import {
    TransactionPreviewComponent,
} from 'wlc-engine/modules/history/components/transaction-history/transaction-preview/transaction-preview.component';
import {Transaction} from 'wlc-engine/modules/history/system/models/transaction-history/transaction-history.model';
import {rangeExceededMsg} from 'wlc-engine/modules/history/system/constants/history.constants';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITransactionHistoryRangeParams {
    type: string,
    historyType: string,
}

export interface ITransactionHistoryCParams extends IComponentParams<Theme, Type, ThemeMod> {
    filterType?: 'select' | 'button';
    tableConfig?: ITableCParams,
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
    historyRangeParams?: ITransactionHistoryRangeParams;
    rangeExceededConfig?: IWrapperCParams;
}

export const transactionTableHeadConfig: ITableCol[] = [
    {
        key: 'date',
        title: gettext('Transaction time'),
        type: 'component',
        order: 10,
        mapValue: (item: Transaction, index?) => {return {transaction: item, index};},
        componentClass: TransactionPreviewComponent,
        wlcElement: 'wlc-profile-table__cell_time',
    },
    {
        key: 'amount',
        title: gettext('Amount'),
        type: 'amount',
        order: 20,
        wlcElement: 'wlc-profile-table__cell_amount',
        currencyUseIcon: true,
    },
    {
        key: 'status',
        title: gettext('Status'),
        type: 'component',
        wlcElement: 'wlc-profile-table__cell_status',
        mapValue: (item: Transaction) => {return {transaction: item};},
        order: 30,
        componentClass: TransactionStatusComponent,
    },
    {
        key: 'system',
        title: gettext('Method'),
        type: 'text',
        order: 40,
        wlcElement: 'wlc-profile-table__cell_method',
    },
    {
        key: 'type',
        title: gettext('Type'),
        type: 'component',
        mapValue: (item: Transaction) => {return {transaction: item};},
        componentClass: TransactionButtonsComponent,
        order: 50,
        wlcElement: 'wlc-profile-table__cell_type',
    },
];

export const defaultParams: ITransactionHistoryCParams = {
    moduleName: 'history',
    componentName: 'wlc-transaction-history',
    class: 'wlc-transaction-history',
    filterType: 'button',
    tableConfig: {
        theme: 'default',
        head: transactionTableHeadConfig,
    },
    emptyConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    text: gettext('No transactions history'),
                },
            },
        ],
    },
    rangeExceededConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    text: rangeExceededMsg,
                },
            },
        ],
    },
    historyRangeParams: {
        type: 'submenu',
        historyType: 'transaction',
    },
};
