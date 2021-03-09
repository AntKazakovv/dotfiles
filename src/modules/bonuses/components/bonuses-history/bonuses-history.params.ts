import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ITableCol} from 'wlc-engine/modules/core/components/table/table.params';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IBonusesHistoryCParams extends IComponentParams<Theme, Type, ThemeMod> {

}

export const defaultParams: IBonusesHistoryCParams = {
    class: 'wlc-bonuses-history',
};

export const betHistoryTableHeadConfig: ITableCol[] = [
    {
        key: 'Name',
        title: gettext('Bonus name'),
        type: 'text',
        order: 20,
        wlcElement: 'wlc-profile-table__cell_name',
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
