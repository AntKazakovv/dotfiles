import {
    IComponentParams,
    CustomType,
    ITableCol,
    IWrapperCParams,
    ITableCParams,
} from 'wlc-engine/modules/core';
import {HistoryNameComponent} from 'wlc-engine/modules/history/components/history-name/history-name.component';
import {IHistoryNameItem} from 'wlc-engine/modules/history/components/history-name/history-name.params';

import {
    TournamentTopwinsBtnComponent,
    // eslint-disable-next-line max-len
} from 'wlc-engine/modules/history/components/tournaments-history/components/tournament-topwins-btn/tournament-topwins-btn.component';
import {ITournamentWinsParams} from 'wlc-engine/modules/history/system/interfaces';
import {TournamentHistory} from 'wlc-engine/modules/history/system/models/tournament-history/tournament-history.model';
import {
    TournamentPrizesRowComponent,
    // eslint-disable-next-line max-len
} from 'wlc-engine/modules/tournaments/components/tournament/components/tournament-prizes-row/tournament-prizes-row.component';

export type Theme = 'default' | 'wolf' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITournamentsHistoryRangeParams {
    type: string;
    historyType: string;
}
export interface ITournamentsHistoryCParams extends IComponentParams<Theme, Type, ThemeMod> {
    tableConfig?: ITableCParams,
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
    historyRangeParams?: ITournamentsHistoryRangeParams;
}

export const tournamentsHistoryTableHeadConfig: ITableCol[] = [
    {
        key: 'name',
        title: gettext('Name'),
        type: 'component',
        mapValue: (item: TournamentHistory): {item: IHistoryNameItem} => {
            return {
                item: {
                    name: item.name,
                    status: item.statusName,
                    id: item.id.toString(),
                    historyType: 'tournaments',
                },
            };
        },
        componentClass: HistoryNameComponent,
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
        title: gettext('Winnings'),
        type: 'component',
        mapValue: (item: TournamentHistory): ITournamentWinsParams => {
            return {
                history: true,
                wins: item.tournamentWins,
            };
        },
        componentClass: TournamentPrizesRowComponent,
        order: 50,
        wlcElement: 'wlc-profile-table__cell_win',
    },
    {
        key: 'start',
        title: gettext('Start date'),
        type: 'date',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_started',
    },
    {
        key: 'end',
        title: gettext('End date'),
        type: 'date',
        order: 50,
        wlcElement: 'wlc-profile-table__cell_ended',
    },
    {
        key: 'statusName',
        title: gettext('Status'),
        type: 'component',
        mapValue: (item: TournamentHistory) => {
            return {tournament: item};
        },
        componentClass: TournamentTopwinsBtnComponent,
        order: 50,
        wlcElement: 'wlc-profile-table__cell_status',
    },
];

export const defaultParams: ITournamentsHistoryCParams = {
    moduleName: 'history',
    componentName: 'wlc-tournaments-history',
    class: 'wlc-tournaments-history',
    theme: 'default',
    tableConfig: {
        theme: 'default',
        head: tournamentsHistoryTableHeadConfig,
    },
    emptyConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    text: gettext('No tournaments history'),
                },
            },
        ],
    },
    historyRangeParams: {
        type: 'submenu',
        historyType: 'tournaments',
    },
};
