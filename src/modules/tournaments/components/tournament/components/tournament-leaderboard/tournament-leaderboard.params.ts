import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    Tournament,
    ThumbType,
} from 'wlc-engine/modules/tournaments';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = ThumbType | CustomType;
export type ThemeMod = 'default' | CustomMod;
export type AutoModifiers = ComponentTheme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ITournamentLeaderboardCParams extends IComponentParams<ComponentTheme, ComponentType, ThemeMod> {
    modifiers?: Modifiers[];
    theme?: ComponentTheme;
    type?: ComponentType;
    common?: {
        themeMod?: ThemeMod;
        customMod?: CustomMod;
        tournament?: Tournament;
        type?: ComponentType;
        limit?: number;
        showAllBtn?: boolean;
        useListHead?: boolean;
    };
}

export const defaultParams: ITournamentLeaderboardCParams = {
    moduleName: 'tournaments',
    class: 'wlc-tournament-leaderboard',
    componentName: 'wlc-tournament-leaderboard',
};
