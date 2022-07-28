import {
    IComponentParams,
    CustomType,
    ITableCParams,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {IGamesGridCParams} from 'wlc-engine/modules/games';
import {TournamentComponent} from 'wlc-engine/modules/tournaments/components/tournament/tournament.component';
import {Tournament} from 'wlc-engine/modules/tournaments/system/models/tournament.model';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ITournamentDetailCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    parentInstance?: TournamentComponent;
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
    common?: {
        tournament?: Tournament,
        noTournamentText?: string;
        rulesSectionTitle?: string;
        gamesSectionTitle?: string;
        prizepoolSectionTitle?: string;
        leaderboardSectionTitle?: string;
        btnSubscribeText?: string;
        btnUnsubscribeText?: string;
        backLinkText?: string;
        timerTextAfterStart?: string;
        timerTextBeforeStart?: string;
        statusAvaliableText?: string;
        statusActiveText?: string;
        prizePoolText?: string;
        tablePrizeboard?: ITournamentDetailTableParams;
        scrollToSelector?: string;
    };
}

export interface ITournamentDetailTableParams extends ITableCParams {
    rows?: ITournamentPrizeRows[]
}
export interface ITournamentPrizeRows {
    Place: number,
    Prize: {
        value: number,
        currency: string
    },
}

export const defaultParams: ITournamentDetailCParams = {
    moduleName: 'tournaments',
    componentName: 'wlc-tournament-detail',
    class: 'wlc-tournament-detail',
    emptyConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    text: gettext('No leaderboard'),
                },
            },
        ],
    },
    common: {
        noTournamentText: gettext('No tournament'),
        rulesSectionTitle: gettext('Rules'),
        gamesSectionTitle: gettext('Games'),
        prizepoolSectionTitle: gettext('Prize pool'),
        leaderboardSectionTitle: gettext('Leaderboard'),
        btnSubscribeText: gettext('Join now'),
        btnUnsubscribeText: gettext('Leave'),
        backLinkText: gettext('Back'),
        timerTextAfterStart: gettext('Time remaining'),
        timerTextBeforeStart: gettext('Coming soon'),
        statusAvaliableText: gettext('Available'),
        statusActiveText: gettext('Active'),
        prizePoolText: gettext('Prize pool'),
        tablePrizeboard: {
            theme: 'tournaments',
            pageCount: 10,
            pagination: {
                use: true,
                breakpoints: {
                    0: {
                        itemPerPage: 10,
                    },
                },
            },
            head: [
                {
                    key: 'Place',
                    title: gettext('Place'),
                    type: 'text',
                    order: 10,
                    wlcElement: 'wlc-tournament-table__cell_place',
                },
                {
                    key: 'Prize',
                    title: gettext('Prize'),
                    type: 'amount',
                    order: 10,
                    wlcElement: 'wlc-profile-table__cell_prize',
                },
            ],
            rows: [],
        },
    },
};

export const gamesGridConfig: IWrapperCParams = {
    class: '',
    components: [
        {
            name: 'games.wlc-games-grid',
            params:<IGamesGridCParams> {
                gamesRows: 3,
                usePlaceholders: true,
                mobileSettings: {
                    gamesRows: 3,
                },
                themeMod: 'tournament-detail',
                thumbParams: {},
            },
        },
    ],
};
