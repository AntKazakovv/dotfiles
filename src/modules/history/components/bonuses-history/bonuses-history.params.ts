import {
    IComponentParams,
    CustomType,
    ITableCParams,
    ITableCol,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {BonusHistoryItemModel} from 'wlc-engine/modules/history/system/models/bonus-history/bonus-history-item.model';
import {HistoryNameComponent} from 'wlc-engine/modules/history/components/history-name/history-name.component';
import {IHistoryNameItem} from 'wlc-engine/modules/history/components/history-name/history-name.params';
import {rangeExceededMsg} from 'wlc-engine/modules/history/system/constants/history.constants';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IBonusesHistoryRangeParams {
    type: string;
    historyType: string;
}

export interface IBonusesHistoryCParams extends IComponentParams<Theme, Type, ThemeMod> {
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
    tableConfig?: ITableCParams;
    historyRangeParams?: IBonusesHistoryRangeParams;
    rangeExceededConfig?: IWrapperCParams;
}

export const bonusHistoryTableHeadConfig: ITableCol[] = [
    {
        key: 'Name',
        title: gettext('Name'),
        type: 'component',
        order: 20,
        wlcElement: 'wlc-profile-table__cell_name',
        mapValue: (item: BonusHistoryItemModel): {item: IHistoryNameItem} => {
            return {
                item: {
                    name: item.Name,
                    status: item.StatusName,
                    id: item.id,
                    historyType: 'bonuses',
                },
            };
        },
        componentClass: HistoryNameComponent,
    },
    {
        key: 'Balance',
        title: gettext('Balance'),
        type: 'amount',
        order: 30,
        wlcElement: 'wlc-profile-table__cell_balance',
    },
    {
        key: 'LoyaltyPoints',
        title: gettext('Loyalty'),
        type: 'text',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_loyalty',
    },
    {
        key: 'ExperiencePoints',
        title: gettext('Experience'),
        type: 'text',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_experience',
    },
    {
        key: 'FreeroundCount',
        title: gettext('Free rounds'),
        type: 'text',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_freerounds',
    },
    {
        key: 'WageringTotal',
        title: gettext('Wagering'),
        type: 'text',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_wagering',
    },
    {
        key: 'End',
        title: gettext('Ended'),
        type: 'date',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_ended',
    },
    {
        key: 'StatusName',
        title: gettext('Status'),
        type: 'text',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_status',
    },
];

export const defaultParams: IBonusesHistoryCParams = {
    moduleName: 'history',
    componentName: 'wlc-bonuses-history',
    class: 'wlc-bonuses-history',
    tableConfig: {
        theme: 'default',
        head: bonusHistoryTableHeadConfig,
    },
    emptyConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    text: gettext('No bonuses history'),
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
        historyType: 'bonus',
    },
};
