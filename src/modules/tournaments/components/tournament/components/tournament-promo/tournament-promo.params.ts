import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ThumbType,
    Tournament,
} from 'wlc-engine/modules/tournaments';
import {TournamentComponent} from 'wlc-engine/modules/tournaments/components/tournament/tournament.component';
import {IIndexing} from 'wlc-engine/modules/core';

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
    parentInstance?: TournamentComponent;
    common?: {
        tournament?: Tournament;
        parentInstance?: TournamentComponent;
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

export const defaultParams: ITournamentPromoCParams = {
    moduleName: 'tournaments',
    class: 'wlc-tournament-promo',
    componentName: 'wlc-tournament-promo',
    common: {},
};
