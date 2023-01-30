import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {
    Tournament,
    ThumbType,
} from 'wlc-engine/modules/tournaments';
import {TournamentHistory} from 'wlc-engine/modules/history/system/models/tournament-history/tournament-history.model';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = ThumbType | CustomType;
export type ThemeMod = 'default' | 'history' | 'tournament-detail' | CustomMod;
export type AutoModifiers = ComponentTheme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ITournamentLeaderboardCParams extends IComponentParams<ComponentTheme, ComponentType, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        customMod?: CustomMod;
        tournament?: Tournament | TournamentHistory;
        type?: ComponentType;
        limit?: number;
        showAllBtn?: boolean;
        useListHead?: boolean;
        useMainCurrency?: boolean;
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
        useMainCurrency: false,
    },
};
