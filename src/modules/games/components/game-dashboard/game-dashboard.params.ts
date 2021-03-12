import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export type DashboardSide = 'left' | 'right';
export type DashboardTab = 'profile' | 'bonuses' | 'tournaments' | 'lastplayed';

export interface IGameDashboardCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        desktopSide: DashboardSide;
        themeMod?: ThemeMod;
    }
}

interface IEvents {
    OPENED: string,
    CLOSED: string,
    CHANED_TAB: string,
};

export const Events: IEvents = {
    OPENED: 'opened@GameDashboard',
    CLOSED: 'closed@GameDashboard',
    CHANED_TAB: 'changedTab@GameDashboard',
};

export interface IChangedTabEvent {
    tab: IGameDashboardTab;
}

export const defaultParams: IGameDashboardCParams = {
    moduleName: 'games',
    componentName: 'game-dashboard',
    class: 'wlc-game-dashboard',
    common: {
        desktopSide: 'right',
    },
};

export interface IGameDashboardTab {
    id: DashboardTab;
    icon: string;
    label?: string;
    auth?: boolean;
    updateOnOpen?: boolean;
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
        label: gettext('My bonuses'),
        updateOnOpen: true,
    },
    // {
    //     id: 'tournaments',
    //     icon: 'game-dashboard/tournaments',
    //     label: gettext('Tournaments'),
    // },
    {
        id: 'lastplayed',
        icon: 'game-dashboard/last-played',
        label: gettext('Last played'),
        auth: true,
        updateOnOpen: true,
    },
];
