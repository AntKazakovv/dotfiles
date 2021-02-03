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
        desktopSide: DashboardSide;
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
    common: {
        desktopSide: 'right',
    },
};

export interface IGameDashboardTab {
    id: string;
    icon: string;
    label?: string;
    auth?: boolean;
}

export const dashboardTabs: IGameDashboardTab[] = [
    {
        id: 'profile',
        icon: 'game-dashboard/profile',
        label: gettext('Profile'),
        auth: true,
    },
    {
        id: 'bonuses',
        icon: 'game-dashboard/bonuses',
        label: gettext('Bonuses'),
    },
    {
        id: 'tournaments',
        icon: 'game-dashboard/tournaments',
        label: gettext('Tournaments'),
    },
    {
        id: 'last-played',
        icon: 'game-dashboard/last-played',
        label: gettext('Last played'),
        auth: true,
    },
];
