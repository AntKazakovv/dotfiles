import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IIndexing} from 'wlc-engine/modules/core';
import * as ButtonParams from 'wlc-engine/modules/core/components/button/button.params';

export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentType = 'default' | 'dashboard' | 'short' | 'mobile' | 'store' | 'header' | CustomType;
export type ComponentThemeMod = 'default' | 'mobile-app' | CustomType;
export type StatsFieldsView = 'abbreviation' | 'fullWithAbbreviation';

export interface IUserStatsCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    fields?: string[];
    useIcons: boolean;
    fieldsView?: StatsFieldsView;
    useDetailsBtn?: boolean;
    detailsBtnText?: string;
    useDepositBtn?: boolean;
    depositBtn?: IDepositButton;
    showTooltipDescriptionModal?: boolean;
}

export interface IUserStatsItemConfig {
    name: string;
    abbreviation?: string;
    modification?: string;
    currency?: string;
    wlcElement?: string;
    path: string;
    iconPath?: string;
}

export interface IButtonOptions {
    text?: string;
    themeMod?: ButtonParams.ThemeMod;
    size?: ButtonParams.Size;
}

export interface IDepositButton {
    default: IButtonOptions,
    menuMobile: IButtonOptions,
}

export const shownUserStatsConfig: IIndexing<IUserStatsItemConfig> = {
    balance: {
        name: gettext('Real balance'),
        abbreviation: 'RB',
        path: 'realBalance',
        iconPath: '/currency/rb.svg',
        modification: 'amount',
        wlcElement: 'block_user-stat-balance-real',
    },
    bonusBalance: {
        name: gettext('Bonus balance'),
        abbreviation: 'BB',
        path: 'bonusBalance',
        iconPath: '/currency/bb.svg',
        modification: 'amount',
        wlcElement: 'block_user-stat-balance-bonus',
    },
    points: {
        name: gettext('Loyalty Points'),
        abbreviation: 'LP',
        modification: 'customCurrency',
        currency: 'LP',
        path: 'loyalty.Balance',
        iconPath: '/currency/lp.svg',
        wlcElement: 'block_user-stat-points',
    },
    level: {
        name: gettext('Level'),
        abbreviation: 'LVL',
        path: 'loyalty.Level',
        iconPath: '/currency/lvl.svg',
        wlcElement: 'block_user-stat-level',
    },
    email: {
        name: gettext('Email'),
        path: 'email',
        wlcElement: 'block_user-stat_email',
    },
    firstName: {
        name: gettext('First name'),
        path: 'firstName',
        wlcElement: 'block_user-stat_firstname',
    },
    lastName: {
        name: gettext('Last name'),
        path: 'lastName',
        wlcElement: 'block_user-stat_lastname',
    },
    levelName: {
        name: gettext('Level name'),
        path: 'levelName',
        modification: 'string',
        wlcElement: 'block_user-stat_level-name',
    },
    login: {
        name: gettext('Login'),
        path: 'loyalty.Login',
        modification: 'string',
        wlcElement: 'block_user-stat_login',
    },
    nextLvlPoints: {
        name: gettext('Next Level Points'),
        path: 'loyalty.NextLevelPoints',
        wlcElement: 'block_user-stat_next-level-points',
    },
    expPoints: {
        name: gettext('Experience points'),
        abbreviation: 'EXP',
        modification: 'customCurrency',
        currency: 'EXP',
        path: 'loyalty.Points',
        iconPath: '/currency/exp.svg',
        wlcElement: 'block_user-stat_expirience-points',
    },
    expPointsTotal: {
        name: gettext('Experience points all time'),
        path: 'loyalty.TotalPoints',
        wlcElement: 'block_user-stat_expirience-points-total',
    },
    levelCoef: {
        name: gettext('Level coefficient'),
        path: 'loyalty.LevelCoef',
        wlcElement: 'block_user-stat_level-coef',
    },
    depositCount: {
        name: gettext('Deposit count'),
        path: 'loyalty.DepositsCount',
        wlcElement: 'block_user-stat_deposit-count',
    },
    freespins: {
        name: gettext('Free spins'),
        path: 'freespins',
        wlcElement: 'block_user-stat_freespins-count',
    },
};

export const defaultParams: Partial<IUserStatsCParams> = {
    class: 'wlc-user-stats',
    moduleName: 'user',
    componentName: 'wlc-user-stats',
    fields: [
        'balance',
        'bonusBalance',
        'points',
        'level',
    ],
    useIcons: false,
    useDetailsBtn: false,
    detailsBtnText: gettext('More info'),
    depositBtn: {
        default: {
            text: gettext('Deposit'),
            themeMod: 'default',
            size: 'default',
        },
        menuMobile: {
            text: gettext('Make a deposit'),
            themeMod: 'secondary',
            size: 'big',
        },
    },
    showTooltipDescriptionModal: false,
};
