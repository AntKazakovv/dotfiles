import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ITournamentListCParams} from 'wlc-engine/modules/tournaments/components/tournament-list/tournament-list.params';
import {ILoyaltyProgressCParams} from 'wlc-engine/modules/user';
import {IGameDashboardBonusesCParams} from 'wlc-engine/modules/bonuses';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | 'wolf' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export type DashboardSide = 'left' | 'right';
export type DashboardTab = 'profile' | 'bonuses' | 'tournaments' | 'lastplayed';

export interface IGameDashboardCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        tournamentsListParams?: ITournamentListCParams;
        loyaltyProgressParams?: ILoyaltyProgressCParams;
        bonusesListParams?: IGameDashboardBonusesCParams;
    }
}

interface IEvents {
    OPENED: string,
    CLOSED: string,
    CHANED_TAB: string,
};

export const GameDashboardEvents: IEvents = {
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
        tournamentsListParams: {
            type: 'dashboard',
            themeMod: 'swiper',
            common: {
                restType: 'any',
                thumbType: 'dashboard',
                swiper: {
                    slidesPerView: 1,
                },
            },
        },
        loyaltyProgressParams: {
            common: {
                showLevelIcon: false,
                showLinkToLevels: true,
            },
        },
    },
};

export interface IGameDashboardTab {
    id: DashboardTab;
    iconPath: string;
    label?: string;
    auth?: boolean;
    updateOnOpen?: boolean;
    hideLabel?: boolean;
}

export const dashboardTabs: IGameDashboardTab[] = [
    {
        id: 'profile',
        iconPath: '/wlc/game-dashboard/profile.svg',
        label: gettext('Profile'),
        auth: true,
        hideLabel: true,
    },
    {
        id: 'bonuses',
        iconPath: '/wlc/game-dashboard/bonuses.svg',
        label: gettext('My bonuses'),
        updateOnOpen: true,
    },
    {
        id: 'tournaments',
        iconPath: '/wlc/game-dashboard/tournaments.svg',
        label: gettext('Tournaments'),
        updateOnOpen: true,
    },
    {
        id: 'lastplayed',
        iconPath: '/wlc/game-dashboard/last-played.svg',
        label: gettext('Last played'),
        auth: true,
        updateOnOpen: true,
    },
];

export const dashboardTabsKiosk: IGameDashboardTab[] = [
    {
        id: 'profile',
        iconPath: '/wlc/game-dashboard/profile.svg',
        label: gettext('Profile'),
        auth: true,
        hideLabel: true,
    },
    {
        id: 'lastplayed',
        iconPath: '/wlc/game-dashboard/last-played.svg',
        label: gettext('Last played'),
        auth: true,
        updateOnOpen: true,
    },
];
