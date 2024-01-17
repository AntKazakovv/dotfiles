import {
    IComponentParams,
    CustomType,
    ITableCol,
    IWrapperCParams,
    ITableCParams,
} from 'wlc-engine/modules/core';
import {Bet} from 'wlc-engine/modules/history/system/models/bet-history/bet-history.model';
import {HistoryNameComponent} from 'wlc-engine/modules/history/components/history-name/history-name.component';
import {IFinancialHistoryNameItem} from 'wlc-engine/modules/history/components/history-name/history-name.params';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IBetHystoryRangeParams {
    type: string,
    historyType: string,
}
export interface IBetHistoryCParams extends IComponentParams<Theme, Type, ThemeMod> {
    tableConfig: ITableCParams,
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
    historyRangeParams?: IBetHystoryRangeParams;
}

export const betHistoryTableHeadConfig: ITableCol[] = [
    {
        key: 'Date',
        title: gettext('Bet time'),
        type: 'component',
        order: 10,
        mapValue: (item: Bet): {item: IFinancialHistoryNameItem} => {
            return {
                item: {
                    date: item.dateISO,
                    amount: item.amount,
                    currency: item.currency,
                    historyType: 'bets',
                },
            };
        },
        componentClass: HistoryNameComponent,
        wlcElement: 'wlc-profile-table__cell_time',
    },
    {
        key: 'amount',
        title: gettext('Amount'),
        type: 'amount',
        currencyUseIcon: true,
        order: 20,
        wlcElement: 'wlc-profile-table__cell_amount',
    },
    {
        key: 'merchant',
        title: gettext('Provider'),
        type: 'text',
        order: 30,
        wlcElement: 'wlc-profile-table__cell_merchant',
    },
    {
        key: 'gameName',
        title: gettext('Game'),
        type: 'text',
        order: 40,
        wlcElement: 'wlc-profile-table__cell_game',
    },
];

export const defaultParams: IBetHistoryCParams = {
    moduleName: 'history',
    componentName: 'wlc-bet-history',
    class: 'wlc-bet-history',
    tableConfig: {
        theme: 'default',
        head: betHistoryTableHeadConfig,
    },
    emptyConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    text: gettext('No bets history'),
                },
            },
        ],
    },
    historyRangeParams: {
        type: 'submenu',
        historyType: 'bet',
    },
};
