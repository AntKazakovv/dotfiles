import {
    IComponentParams,
    CustomType,
    ITableCol,
    ICurrencyCParams,
} from 'wlc-engine/modules/core';
import {CurrencyComponent} from 'wlc-engine/modules/core/components/currency/currency.component';
import {
    HistoryNameComponent,
} from 'wlc-engine/modules/core/components/table/components/history-name/history-name.component';
import {IHistoryNameItem} from 'wlc-engine/modules/core/components/table/components/history-name/history-name.params';
import {
    TournamentHistory,
    TournamentTopwinsBtnComponent,
} from 'wlc-engine/modules/tournaments';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITournamentsHistoryCParams extends IComponentParams<Theme, Type, ThemeMod> {}

export const defaultParams: ITournamentsHistoryCParams = {
    class: 'wlc-tournaments-history',
};

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
        title: gettext('Win'),
        type: 'component',
        mapValue: (item: TournamentHistory): ICurrencyCParams => {
            return {
                value: item.win,
                currency: item.targetCurrency,
            };
        },
        componentClass: CurrencyComponent,
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
        type: 'component',
        mapValue: (item: TournamentHistory) => {
            return {tournament: item};
        },
        componentClass: TournamentTopwinsBtnComponent,
        order: 50,
        wlcElement: 'wlc-profile-table__cell_status',
    },
];
