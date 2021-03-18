import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ThumbType,
    Tournament,
} from 'wlc-engine/modules/tournaments';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = ThumbType | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = ComponentTheme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ITournamentPromoCParams extends IComponentParams<ComponentTheme, ComponentType, ThemeMod> {
    modifiers?: Modifiers[];
    theme?: ComponentTheme;
    type?: ComponentType;
    tournament?: Tournament;
    common?: {
        tournament?: Tournament;
        themeMod?: ThemeMod;
        customMod?: CustomMod;
        type?: ComponentType;
    }
}

export const defaultParams: ITournamentPromoCParams = {
    moduleName: 'tournaments',
    class: 'wlc-tournament-promo',
    componentName: 'wlc-tournament-promo',
};
