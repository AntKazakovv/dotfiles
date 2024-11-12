import {
    IComponentParams,
    CustomType,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {IGamesGridCParams} from 'wlc-engine/standalone/games/components/games-grid/games-grid.params';
import {ITournamentPrizesCParams} from '../tournament-prizes/tournament-prizes.params';
import {TournamentComponent} from 'wlc-engine/modules/tournaments/components/tournament/tournament.component';
import {Tournament} from 'wlc-engine/modules/tournaments/system/models/tournament.model';

export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = ComponentTheme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;
export type TournamentStatus = 'active' | 'available' | 'coming-soon';
export interface ITournamentDetailCParams extends IComponentParams<ComponentTheme, ComponentType, ThemeMod> {
    modifiers?: Modifiers[];
    parentInstance?: TournamentComponent;
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
    common?: {
        tournament?: Tournament,
        noTournamentText?: string;
        rulesSectionTitle?: string;
        gamesSectionTitle?: string;
        levelsTitle?: string;
        levelsText?: string;
        prizepoolSectionTitle?: string;
        leaderboardSectionTitle?: string;
        btnSubscribeText?: string;
        btnUnsubscribeText?: string;
        backLinkText?: string;
        statusAvaliableText?: string;
        statusActiveText?: string;
        prizePoolText?: string;
        scrollToSelector?: string;
    };
    prizesParams?: ITournamentPrizesCParams;
    gamesGridConfig?: IGamesGridCParams;
    /**
     * @deprecated anchors menu will be deleted
     * */
    useAnchorsMenu: boolean;
}

export const defaultParams: ITournamentDetailCParams = {
    moduleName: 'tournaments',
    componentName: 'wlc-tournament-detail',
    class: 'wlc-tournament-detail',
    theme: 'default',
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
        levelsTitle: gettext('Levels'),
        levelsText: gettext('Available for the following levels:'),
        prizepoolSectionTitle: gettext('Prize pool'),
        leaderboardSectionTitle: gettext('Leaderboard'),
        btnSubscribeText: gettext('Join'),
        btnUnsubscribeText: gettext('Leave'),
        backLinkText: gettext('Back'),
        statusAvaliableText: gettext('Available'),
        statusActiveText: gettext('Active'),
        prizePoolText: gettext('Prize pool'),
    },
    prizesParams: {
        theme: 'long',
        showMore: {
            use: true,
            rowLimit: 10,
        },
        prizesRowParams: {
            useSmartDemicals: true,
        },
    },
    gamesGridConfig: {
        gamesRows: 3,
        usePlaceholders: true,
        mobileSettings: {
            gamesRows: 3,
        },
        themeMod: 'tournament-detail',
        thumbParams: {},
        openContext: 'tournament',
    },
    useAnchorsMenu: false,
};
