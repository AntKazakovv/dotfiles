import {
    IComponentParams,
    CustomType,
    IWrapperCParams,
    ITableCol,
    ITableCParams,
} from 'wlc-engine/modules/core';
import {HistoryNameComponent} from 'wlc-engine/modules/history/components/history-name/history-name.component';
import {IHistoryNameItem} from 'wlc-engine/modules/history/components/history-name/history-name.params';
import {OrderHistoryItemModel} from 'wlc-engine/modules/history/system/models/orders-history/orders-history.model';

export type Theme = 'default' | 'wolf' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type Type = 'default' | CustomType;

export interface IOrdersHistoryRangeParams {
    type: string,
    historyType: string,
}

export interface IOrdersHistoryCParams extends IComponentParams<Theme, Type, ThemeMod> {
    filterType?: 'select' | 'button';
    tableConfig?: ITableCParams,
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
    historyRangeParams?: IOrdersHistoryRangeParams;
}

export const ordersHistoryTableHeadConfig: ITableCol[] = [
    {
        key: 'name',
        title: gettext('Name'),
        type: 'component',
        order: 20,
        wlcElement: 'wlc-profile-table__cell_name',
        mapValue: (item: OrderHistoryItemModel): {item: IHistoryNameItem} => {
            return {
                item: {
                    name: item.name,
                    historyType: 'orders',
                },
            };
        },
        componentClass: HistoryNameComponent,
    },
    {
        key: 'amount',
        title: gettext('Loyalty'),
        type: 'text',
        order: 30,
        wlcElement: 'wlc-profile-table__cell_amount',
    },
    {
        key: 'amountExperience',
        title: gettext('Experience'),
        type: 'text',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_experience',
    },
    {
        key: 'addDate',
        title: gettext('Date of purchase'),
        type: 'date',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_date',
    },
    {
        key: 'status',
        title: gettext('Status'),
        type: 'text',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_status',
    },
];

export const defaultParams: IOrdersHistoryCParams = {
    moduleName: 'history',
    componentName: 'wlc-orders-history',
    class: 'wlc-orders-history',
    filterType: 'button',
    tableConfig: {
        theme: 'default',
        head: ordersHistoryTableHeadConfig,
    },
    emptyConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    text: gettext('No purchase history'),
                },
            },
        ],
    },
    historyRangeParams: {
        type: 'submenu',
        historyType: 'orders',
    },
};
