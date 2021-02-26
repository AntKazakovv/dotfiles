import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ITableCol} from 'wlc-engine/modules/core/components/table/table.params';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IBonusesHistoryCParams extends IComponentParams<Theme, Type, ThemeMod> {

}

export const defaultParams: IBonusesHistoryCParams = {
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
        disableHideClass: true,
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
