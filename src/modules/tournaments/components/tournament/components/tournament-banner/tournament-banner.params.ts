import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ThumbType,
    Tournament,
    TournamentComponent,
} from 'wlc-engine/modules/tournaments';
import {IIndexing} from 'wlc-engine/modules/core';

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
        actionParams?: IActionParams
    }
}

export interface IActionParams {
    modal?: {
        name?: string;
    },
    url?: {
        path?: string;
        params?: IIndexing<string | number>;
    },
    selector?: string;
}

export const defaultParams: ITournamentBannerCParams = {
    moduleName: 'tournaments',
    class: 'wlc-tournament-banner',
    componentName: 'wlc-tournament-banner',
};
