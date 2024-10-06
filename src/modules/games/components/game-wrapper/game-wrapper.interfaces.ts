import {RawParams} from '@uirouter/core';

import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {DashboardSide} from 'wlc-engine/modules/games/components/game-dashboard/game-dashboard.params';
import {Game} from 'wlc-engine/modules/games/system/models';
import {
    ICustomGameParams,
    ILaunchInfo,
} from 'wlc-engine/modules/games/system/interfaces';

export type Type = 'default' | CustomType;
export type Theme = 'default' | 'fullscreen-game-frame' | CustomType;
export type ThemeMod = 'default' | 'wolf' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IGameWrapperCParams extends IComponentParams<Theme, Type, ThemeMod> {
    updateOnWindowResize?: boolean;
    padding?: number;
    gameParams?: ICustomGameParams;
    type?: Type;
    dashboardSide?: DashboardSide,
    calcWidth?: boolean,
}

export interface IError {
    msg?: string;
    state?: string;
    stateParams?: RawParams;
}

export const gameWrapperHooks = {
    launchInfo: 'launchInfo@GameWrapperComponent',
    evalScript: 'evalScript@GameWrapperComponent',
    iframeShown: 'iframeShown@GameWrapperComponent',
};

export interface IGameWrapperHookLaunchInfo {
    game: Game;
    launchInfo: ILaunchInfo;
    customGameParams: ICustomGameParams;
    demo: boolean;
}

export interface IGameWrapperHookEvalScript {
    game: Game;
    customGameParams: ICustomGameParams;
    disable: boolean;
}

export interface IGameWrapperHookIframeShown {
    iframe: HTMLElement;
    mobile: boolean;
    launchInfo: ILaunchInfo;
}
