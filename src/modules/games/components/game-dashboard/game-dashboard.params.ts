import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export type DashboardSide = 'left' | 'right';

export interface IGameDashboardCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        side: DashboardSide;
        themeMod?: ThemeMod;
    }
}

export const Events: IIndexing<string> = {
    OPENED: 'opened@GameDashboard',
    CLOSED: 'closed@GameDashboard',
};

export const defaultParams: IGameDashboardCParams = {
    moduleName: 'games',
    componentName: 'game-dashboard',
    class: 'wlc-game-dashboard',
};

export interface IGameDashboardTab {
    id: string;
    icon: string;
}

export const dashboardTabs = [
    {
        id: 'profile',
        icon: 'game-dashboard/profile',
    },
    {
        id: 'bonuses',
        icon: 'game-dashboard/bonuses',
    },
    {
        id: 'tournaments',
        icon: 'game-dashboard/tournaments',
    },
    {
        id: 'last-played',
        icon: 'game-dashboard/last-played',
    },
];
