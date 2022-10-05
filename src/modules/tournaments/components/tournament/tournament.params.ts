import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    Tournament,
    ThumbType,
} from 'wlc-engine/modules/tournaments';

export type ComponentTheme = 'default' | 'dashboard' | 'active' | 'available' | 'banner' | 'detail' | CustomType;
export type ComponentType = ThumbType | CustomType;
export type ThemeMod = 'default' | CustomMod;
export type AutoModifiers = ComponentTheme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ITournamentCParams extends IComponentParams<ComponentTheme, ComponentType, ThemeMod> {
    modifiers?: Modifiers[];
    theme?: ComponentTheme;
    tournament?: Tournament;
    type?: ComponentType;
    common?: {
        themeMod?: ThemeMod;
        customMod?: CustomMod;
        type?: ComponentType;
        tournament?: Tournament;
        descriptionClamp?: number,
    };
    isAlternative?: boolean,
}

export const defaultParams: ITournamentCParams = {
    moduleName: 'tournaments',
    class: 'wlc-tournament',
    componentName: 'wlc-tournament',
    common: {
        descriptionClamp: 2,
    },
};
