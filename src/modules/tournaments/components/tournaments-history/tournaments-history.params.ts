import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ITableCol} from 'wlc-engine/modules/core/components/table/table.params';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITournamentsHistoryCParams extends IComponentParams<Theme, Type, ThemeMod> {

}

export const defaultParams: ITournamentsHistoryCParams = {
    class: 'wlc-tournaments-history',
};

export const tournamentsHistoryTableHeadConfig: ITableCol[] = [
    {
        key: 'name',
        title: gettext('Name'),
        type: 'text',
        order: 20,
        wlcElement: 'wlc-profile-table__cell_name',
    },
    {
        key: 'place',
        title: gettext('Place'),
        type: 'text',
        order: 30,
        wlcElement: 'wlc-profile-table__cell_place',
    },
    {
        key: 'points',
        title: gettext('Points'),
        type: 'text',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_points',
    },
    {
        key: 'win',
        title: gettext('Win'),
        type: 'text',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_win',
    },
    {
        key: 'start',
        title: gettext('Start'),
        type: 'date',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_started',
    },
    {
        key: 'end',
        title: gettext('End'),
        type: 'date',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_ended',
    },
    {
        key: 'statusName',
        title: gettext('Status'),
        type: 'text',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_status',
    },
];
