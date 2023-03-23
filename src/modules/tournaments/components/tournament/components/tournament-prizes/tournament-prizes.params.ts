import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ThumbType} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';
import {Tournament} from 'wlc-engine/modules/tournaments/system/models/tournament.model';
import {ITournamentPrizesRowCParams} from '../tournament-prizes-row/tournament-prizes-row.params';

export type ComponentTheme = 'default' | 'podium' | 'long' | CustomType;
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
    },
    showMore?: {
        use?: boolean;
        rowLimit?: number;
    },
    prizesRowParams?: ITournamentPrizesRowCParams;
}

export const PRIMARY_ROW_LIMIT = 3;

export const defaultParams: ITournamentPrizesCParams = {
    moduleName: 'tournaments',
    class: 'wlc-tournament-prizes',
    componentName: 'wlc-tournament-prizes',
    showMore: {
        use: true,
    },
};
