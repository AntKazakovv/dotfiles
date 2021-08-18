import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ITableCol} from 'wlc-engine/modules/core/components/table/table.params';
import {Transaction} from 'wlc-engine/modules/finances/system/models/transaction-history.model';
import {
    TransactionPreviewComponent,
} from 'wlc-engine/modules/finances/components/transaction-history/transaction-preview/transaction-preview.component';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IBetHistoryCParams extends IComponentParams<Theme, Type, ThemeMod> {

}

export const defaultParams: IBetHistoryCParams = {
    class: 'wlc-bet-history',
};

export const betHistoryTableHeadConfig: ITableCol[] = [
    {
        key: 'index',
        title: '#',
        type: 'component',
        order: 10,
        mapValue: (item: Transaction, index?) => {return {transaction: item, index};},
        componentClass: TransactionPreviewComponent,
        wlcElement: 'wlc-profile-table__cell_num',
    },
    {
        key: 'Date',
        title: gettext('Bet time'),
        type: 'date',
        order: 20,
        wlcElement: 'wlc-profile-table__cell_time',
    },
    {
        key: 'Amount',
        title: gettext('Amount'),
        type: 'amount',
        order: 30,
        wlcElement: 'wlc-profile-table__cell_amount',
    },
    {
        key: 'Merchant',
        title: gettext('Merchant'),
        type: 'text',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_merchant',
    },
    {
        key: 'GameName',
        title: gettext('Game'),
        type: 'text',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_game',
    },
];
