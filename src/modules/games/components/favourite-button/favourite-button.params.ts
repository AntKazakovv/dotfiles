import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {Game} from 'wlc-engine/modules/games/system/models';

export type Type = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IFavouriteButtonCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    game?: Game;
    icon?: string;
}

export const defaultParams:  IFavouriteButtonCParams = {
    moduleName: 'games',
    componentName: 'wlc-favourite-button',
    class: 'wlc-favourite-button',
    icon: '/wlc/icons/favourite.svg',
};
