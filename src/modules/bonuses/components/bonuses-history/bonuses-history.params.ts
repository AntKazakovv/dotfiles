import {
    IComponentParams,
    CustomType,
    ITableCol,
    IWrapperCParams,
    IHistoryNameItem,
    HistoryNameComponent,
} from 'wlc-engine/modules/core';
import {HistoryItemModel} from 'wlc-engine/modules/bonuses/system/models/bonus-history-item/bonus-history-item.model';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IBonusesHistoryCParams extends IComponentParams<Theme, Type, ThemeMod> {
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
}

export const defaultParams: IBonusesHistoryCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonuses-history',
    class: 'wlc-bonuses-history',
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
};

export const bonusHistoryTableHeadConfig: ITableCol[] = [
    {
        key: 'Name',
        title: gettext('Bonus name'),
        type: 'component',
        order: 20,
        wlcElement: 'wlc-profile-table__cell_name',
        mapValue: (item: HistoryItemModel): {item: IHistoryNameItem} => {
            return {
                item: {
                    name: item.Name,
                    status: item.StatusName,
                    id: item.id,
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
        title: gettext('Freerounds'),
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
