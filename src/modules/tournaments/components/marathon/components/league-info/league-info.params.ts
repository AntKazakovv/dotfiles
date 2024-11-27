import {
    IComponentParams,
    CustomType,
    GlobalHelper,
    IModalConfig,
    ITooltipCParams,
} from 'wlc-engine/modules/core';
import {League} from 'wlc-engine/modules/tournaments/system/models/league.model';
import {
    ITournamentLeaderboardCParams,
// eslint-disable-next-line max-len
} from 'wlc-engine/modules/tournaments/components/tournament/components/tournament-leaderboard/tournament-leaderboard.params';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILeagueInfoCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    league?: League;
    isModal?: boolean;
    defaultImagePath?: string,
    fallbackImagePath?: string,
    leaderboardTitle?: string,
    joinCallback?: () => void,
    leaderboardParams?: ITournamentLeaderboardCParams,
    modalParams?: IModalConfig,
    tooltipParams?: ITooltipCParams,
}

export const defaultParams: ILeagueInfoCParams = {
    moduleName: 'tournaments',
    componentName: 'wlc-league-info',
    class: 'wlc-league-info',
    defaultImagePath: GlobalHelper.gstaticUrl + '/wlc/tournaments/marathon/league-description.jpg',
    fallbackImagePath: GlobalHelper.gstaticUrl + '/wlc/tournaments/marathon/league-description.jpg',
    leaderboardTitle: gettext('Leaderboard'),
    leaderboardParams: {
        common: {
            limit: 10,
            showAllBtn: true,
            useListHead: true,
        },
        displayPlayerName: 'login',
    },
    modalParams: {
        id: 'league-info',
        modifier: 'league-info-modal',
        componentName: 'tournaments.wlc-league-info',
        size: 'md',
        backdrop: true,
        dismissAll: true,
        closeBtnParams: {
            themeMod: 'secondary',
            common: {
                text: gettext('Close'),
            },
        },
        confirmBtnParams: {
            common: {
                text: gettext('Join'),
            },
        },
    },
    tooltipParams: {
        inlineText: '',
    },
};
