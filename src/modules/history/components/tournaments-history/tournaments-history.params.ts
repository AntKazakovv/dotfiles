import {
    IComponentParams,
    CustomType,
    ITableCol,
    ICurrencyCParams,
    IWrapperCParams,
    CurrencyComponent,
    HistoryNameComponent,
    IHistoryNameItem,
} from 'wlc-engine/modules/core';
import {
    TournamentTopwinsBtnComponent,
    // eslint-disable-next-line max-len
} from 'wlc-engine/modules/history/components/tournaments-history/components/tournament-topwins-btn/tournament-topwins-btn.component';
import {TournamentHistory} from 'wlc-engine/modules/history/system/models/tournament-history/tournament-history.model';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITournamentsHistoryCParams extends IComponentParams<Theme, Type, ThemeMod> {
    transactionTableTheme: 'default' | 'mobile-app' | Theme,
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
}

export const defaultParams: ITournamentsHistoryCParams = {
    moduleName: 'tournament',
    componentName: 'wlc-tournaments-history',
    class: 'wlc-tournaments-history',
    transactionTableTheme: 'default',
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
