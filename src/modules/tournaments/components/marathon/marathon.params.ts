import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    IModalConfig,
    INoContentCParams,
    ITableCol,
    ITableCParams,
} from 'wlc-engine/modules/core';
import {IGamesGridCParams} from 'wlc-engine/standalone/games/components/games-grid/games-grid.params';
import {
    LeagueStatusComponent,
} from 'wlc-engine/modules/tournaments/components/marathon/components/league-status/league-status.component';
import {
    LeagueInfoComponent,
} from 'wlc-engine/modules/tournaments/components/marathon/components/league-info/league-info.component';
import {
    LeaguePlaceComponent,
} from 'wlc-engine/modules/tournaments/components/marathon/components/league-place/league-place.component';
import {
    ILeaguePlaceCParams,
} from 'wlc-engine/modules/tournaments/components/marathon/components/league-place/league-place.params';
import {
    ITournamentPrizesRowCParams,
// eslint-disable-next-line max-len
} from 'wlc-engine/modules/tournaments/components/tournament/components/tournament-prizes-row/tournament-prizes-row.params';
import {
    IMarathonBannerCParams,
} from 'wlc-engine/modules/tournaments/components/marathon/components/marathon-banner/marathon-banner.params';
import {League} from 'wlc-engine/modules/tournaments/system/models/league.model';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;
export type MarathonNoContentByThemeType = Partial<Record<ComponentTheme, INoContentCParams>>;

export interface IMarathonSectionNames {
    leaderboard: string;
    games: string;
    rules: string;
}

export interface IMarathonCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    tableParams?: ITableCParams;
    gamesGridParams?: IGamesGridCParams;
    marathonBannerParams?: IMarathonBannerCParams;
    tournamentPrizesRowParams?: ITournamentPrizesRowCParams;
    marathonTitle?: string;
    noLeaguesImagePath?: string;
    noLeaguesImageFallbackPath?: string;
    noLeaguesTitle?: string;
    noLeaguesDescription?: string;
    joinLeagueConfirmationModal?: IModalConfig;
    noContent?: MarathonNoContentByThemeType;
    sectionNames?: IMarathonSectionNames;
    updateIntervalMs?: number;
    sortLeagues?: (leagues: League[]) => League[] | null;
}

export const defaultParams: IMarathonCParams = {
    moduleName: 'tournaments',
    class: 'wlc-marathon',
    componentName: 'wlc-marathon',
    marathonTitle: gettext('Streamer leagues'),
    tableParams: {
        theme: 'default',
        switchWidth: 900,
        pagination: {
            use: false,
            breakpoints: {},
        },
    },
    joinLeagueConfirmationModal: {
        id: 'join-league-confirmation-modal',
        modifier: 'confirmation',
        modalTitle: gettext('Confirmation'),
        modalMessage: [
            gettext('Are you sure?'),
            gettext('Once you join a league, you will not be able to leave it or join another one'),
        ],
        textAlign: 'center',
        showConfirmBtn: true,
        confirmBtnText: gettext('Yes'),
        closeBtnParams: {
            themeMod: 'secondary',
            common: {
                text: gettext('No'),
            },
        },
    },
    gamesGridParams: {
        gamesRows: 3,
        usePlaceholders: true,
        themeMod: '',
        thumbParams: {
            type: 'simple',
            themeMod: 'default',
        },
    },
    noLeaguesImagePath: '/wlc/tournaments/marathon/swords-colored.png',
    noLeaguesImageFallbackPath: '/wlc/tournaments/marathon/swords-colored.png',
    noLeaguesTitle: gettext('New leagues are coming soon'),
    noLeaguesDescription: gettext('Cheer yourself up with our new and popular games.'),
    sectionNames: {
        leaderboard: gettext('Prize pool'),
        games: gettext('Games'),
        rules: gettext('Rules'),
    },
    updateIntervalMs: 30000,
    sortLeagues: (leagues: League[]) => {
        return leagues?.sort?.((a: League, b: League) => {
            return b.playersTotalPoints - a.playersTotalPoints;
        }) ?? null;
    },
};

export const marathonLeaderboardTableHeadConfig: ITableCol[] = [
    {
        key: 'leaguePlace',
        title: gettext('Place'),
        type: 'component',
        order: 10,
        componentClass: LeaguePlaceComponent,
        mapValue: (league: League, index: number): ILeaguePlaceCParams => ({league, place: index + 1}),
        wlcElement: 'wlc-marathon-table__cell_place',
    },
    {
        key: 'name',
        title: gettext('League name'),
        type: 'text',
        order: 20,
        wlcElement: 'wlc-marathon-table__cell_league',
    },
    {
        key: 'playersTotalPoints',
        title: gettext('Points'),
        type: 'text',
        order: 30,
        wlcElement: 'wlc-marathon-table__cell_points',
    },
    {
        key: 'playersCount',
        title: gettext('Members'),
        type: 'text',
        order: 40,
        wlcElement: 'wlc-marathon-table__cell_members',
    },
    {
        key: 'leagueStatus',
        title: gettext('Status'),
        type: 'component',
        order: 50,
        componentClass: LeagueStatusComponent,
        wlcElement: 'wlc-marathon-table__cell_status',
    },
    {
        key: 'leagueInfo',
        title: gettext('Info'),
        type: 'component',
        order: 60,
        componentClass: LeagueInfoComponent,
        wlcElement: 'wlc-marathon-table__cell_info',
    },
];
