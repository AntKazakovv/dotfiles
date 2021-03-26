import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ITableCParams} from 'wlc-engine/modules/core';
import {TournamentComponent} from 'wlc-engine/modules/tournaments/components/tournament/tournament.component';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ITournamentDetailCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    parentInstance?: TournamentComponent;
    common?: {
        tournamentId?: number
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
        tablePrizeboard: ITableCParams;
        scrollToSelector?: string;
    };
}

export const defaultParams: ITournamentDetailCParams = {
    moduleName: 'tournaments',
    componentName: 'wlc-tournament-detail',
    class: 'wlc-tournament-detail',
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
            theme: "tournaments",
            pageCount: 10,
            noItemsText: gettext("No leaderboard"),
            head: [
                {
                    key: "Place",
                    title: gettext("Place"),
                    type: "text",
                    order: 10,
                    wlcElement: "wlc-tournament-table__cell_place",
                },
                {
                    key: "Prize",
                    title: gettext("Prize"),
                    type: "amount",
                    order: 10,
                    wlcElement: "wlc-profile-table__cell_prize",
                },
                {
                    key: "Percent",
                    title: gettext("Percent"),
                    type: "text",
                    order: 10,
                    wlcElement: "wlc-profile-table__cell_percent",
                },
            ],
            rows: [],
        },
    },
};
