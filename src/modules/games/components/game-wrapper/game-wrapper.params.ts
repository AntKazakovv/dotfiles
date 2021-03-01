import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ICustomGameParams} from '../../system/interfaces/games.interfaces';

export type Type = 'default' | CustomType;
export type Theme = 'default' | 'fullscreen-game-frame' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IGameWrapperCParams extends IComponentParams<Theme, Type, ThemeMod> {
    updateOnWindowResize?: boolean;
    padding?: number;
    gameParams: ICustomGameParams;
    type?: Type;
}

export const defaultParams: IGameWrapperCParams = {
    class: 'wlc-game-wrapper',
    updateOnWindowResize: true,
    padding: 0,
    gameParams: undefined,
};
