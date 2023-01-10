import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ThumbType,
    Tournament,
} from 'wlc-engine/modules/tournaments';

export type ComponentTheme = 'default' | 'podium' | CustomType;
export type ComponentType = ThumbType | CustomType;
export type ThemeMod = 'default' | 'compact' | CustomType;
export type AutoModifiers = ComponentTheme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ITournamentPrizesCParams extends IComponentParams<ComponentTheme, ComponentType, ThemeMod> {
    modifiers?: Modifiers[];
    theme?: ComponentTheme;
    type?: ComponentType;
    tournament?: Tournament;
    common?: {
        tournament?: Tournament;
        themeMod?: ThemeMod;
        customMod?: CustomMod;
        type?: ComponentType;
        rowLimit: number;
    }
}

export const PRIMARY_ROW_LIMIT = 3;

export const defaultParams: ITournamentPrizesCParams = {
    moduleName: 'tournaments',
    class: 'wlc-tournament-prizes',
    componentName: 'wlc-tournament-prizes',
};
