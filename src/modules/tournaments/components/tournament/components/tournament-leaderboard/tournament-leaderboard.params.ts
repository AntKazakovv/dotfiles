import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {ThumbType} from 'wlc-engine/modules/tournaments';
import {TournamentHistory} from 'wlc-engine/modules/history/system/models/tournament-history/tournament-history.model';

export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentType = ThumbType | CustomType;
export type ThemeMod = 'default' | 'history' | 'tournament-detail' | CustomMod;
export type AutoModifiers = ComponentTheme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ITournamentLeaderboardCParams extends IComponentParams<ComponentTheme, ComponentType, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        customMod?: CustomMod;
        tournament?: TournamentHistory;
        type?: ComponentType;
        limit?: number;
        showAllBtn?: boolean;
        useListHead?: boolean;
        winbetRatioText?: string;
        freeSpinsText?: string;
    };
    /**
     * this option is used how to display the name in leaderboard (it can be shown userId or userLogin for example)
     */
    displayPlayerName: 'login' | 'id';
}

export const defaultParams: ITournamentLeaderboardCParams = {
    moduleName: 'tournaments',
    class: 'wlc-tournament-leaderboard',
    componentName: 'wlc-tournament-leaderboard',
    displayPlayerName: 'login',
    common: {
        winbetRatioText: gettext('The winner is considered by the closest approximation to the coefficient:'),
        freeSpinsText: gettext('Leaderboard is updated according to the results of free rounds package completion'),
    },
};
