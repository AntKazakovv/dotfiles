import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ITableCol} from 'wlc-engine/modules/core/components/table/table.params';
import {TransactionStatusComponent} from 'wlc-engine/modules/finances/components/transaction-history/transaction-status/transaction-status.component';
import {TransactionCancelComponent} from 'wlc-engine/modules/finances/components/transaction-history/transaction-cancel/transaction-cancel.component';
import {Transaction} from 'wlc-engine/modules/finances/system/models/transaction-history.model';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ILoyaltyLevelTableCParams extends IComponentParams<Theme, Type, ThemeMod> {
    filterType?: 'select' | 'button',
}

export const defaultParams: ILoyaltyLevelTableCParams = {
    class: 'wlc-loyalty-table',
};

export const loyaltyTableHeadConfig: ITableCol[] = [
    {
        key: 'Level',
        title: gettext('Level'),
        type: 'text',
        order: 20,
        wlcElement: 'wlc-profile-table__cell_time',
    },
    {
        key: 'Name',
        title: gettext('Level name'),
        type: 'text',
        disableHideClass: true,
        order: 30,
        wlcElement: 'wlc-profile-table__cell_level',
    },
    {
        key: 'NextLevelPoints',
        title: gettext('Experience'),
        type: 'text',
        wlcElement: 'wlc-profile-table__cell_status',
        order: 40,
    },
    {
        key: 'Coef',
        title: gettext('Coefficient'),
        type: 'text',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_method',
    },
];
