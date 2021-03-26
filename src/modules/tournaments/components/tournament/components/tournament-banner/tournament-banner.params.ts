import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ThumbType,
    Tournament,
} from 'wlc-engine/modules/tournaments';
import {TournamentComponent} from 'wlc-engine/modules/tournaments/components/tournament/tournament.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = ThumbType | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = ComponentTheme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ITournamentBannerCParams extends IComponentParams<ComponentTheme, ComponentType, ThemeMod> {
    modifiers?: Modifiers[];
    theme?: ComponentTheme;
    type?: ComponentType;
    tournament?: Tournament;
    parentInstance?: TournamentComponent;
    common?: {
        parentInstance?: TournamentComponent;
        tournament?: Tournament;
        themeMod?: ThemeMod;
        customMod?: CustomMod;
        type?: ComponentType;
    }
}

export const defaultParams: ITournamentBannerCParams = {
    moduleName: 'tournaments',
    class: 'wlc-tournament-banner',
    componentName: 'wlc-tournament-banner',
};
