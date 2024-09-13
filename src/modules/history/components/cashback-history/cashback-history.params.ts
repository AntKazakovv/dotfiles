import {
    IComponentParams,
    CustomType,
    ITableCParams,
    ITableCol,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {
    CashbackPreviewComponent,
} from 'wlc-engine/modules/history/components/cashback-history/cashback-preview/cashback-preview.component';
import {
    CashbackHistoryModel,
} from 'wlc-engine/modules/history/system/models/cashback-history/cashback-history.model';

export type ComponentTheme = 'default'| 'wolf' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ICashbackHystoryRangeParams {
    type: string,
    historyType: string,
}

export interface ICashbackHistoryCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    tableConfig: ITableCParams;
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
    historyRangeParams?: ICashbackHystoryRangeParams;
}

export const cashbackHistoryTableHeadConfig: ITableCol[] = [
    {
        key: 'AddDate',
        title: gettext('Date'),
        type: 'component',
        order: 10,
        mapValue: (item: CashbackHistoryModel) => ({cashback: item}),
        componentClass: CashbackPreviewComponent,
        wlcElement: 'wlc-profile-table__cell_date',
    },
    {
        key: 'AmountConverted',
        title: gettext('Amount'),
        type: 'amount',
        order: 20,
        wlcElement: 'wlc-profile-table__cell_amount',
    },
    {
        key: 'ID',
        title: gettext('ID'),
        type: 'text',
        order: 30,
        wlcElement: 'wlc-profile-table__cell_id',
    },
    {
        key: 'Deposits',
        title: gettext('Deposit'),
        type: 'amount',
        order: 40,
        wlcElement: 'wlc-profile-table__cell_deposit',
    },
    {
        key: 'Withdrawals',
        title: gettext('Withdrawal'),
        type: 'amount',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_windrawal',
    },
    {
        key: 'Period',
        title: gettext('Period'),
        type: 'text',
        order: 60,
        wlcElement: 'wlc-profile-table__cell_period',
    },
];

export const defaultParams: ICashbackHistoryCParams = {
    moduleName: 'history',
    componentName: 'wlc-cashback-history',
    class: 'wlc-cashback-history',
    tableConfig: {
        theme: 'default',
        head: cashbackHistoryTableHeadConfig,
    },
    emptyConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    iconPath: '/wlc/icons/icons_new/empty-table-bg.svg',
                    text: gettext('No cashback history'),
                },
            },
        ],
    },
    historyRangeParams: {
        type: 'submenu',
        historyType: 'cashback',
    },
};
