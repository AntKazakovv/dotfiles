import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IIndexing} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IUserStatsCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    fields?: string[];
    type?: ComponentType;
    theme?: ComponentTheme;
    useDepositBtn?: boolean;
    showTooltipDescriptionModal?: boolean;
}

export interface IUserStatsItemConfig {
    name: string;
    modification?: string;
    currency?: string;
    wlcElement?: string;
    path: string;
}

export const shownUserStatsConfig: IIndexing<IUserStatsItemConfig> = {
    balance: {
        name: gettext('Real balance'),
        path: 'realBalance',
        modification: 'amount',
        wlcElement: 'block_user-stat-balance-real',
    },
    bonusBalance: {
        name: gettext('Bonus balance'),
        path: 'bonusBalance',
        modification: 'amount',
        wlcElement: 'block_user-stat-balance-bonus',
    },
    points: {
        name: gettext('LP'),
        modification: 'customCurrency',
        currency: 'LP',
        path: 'loyalty.Balance',
        wlcElement: 'block_user-stat-points',
    },
    level: {
        name: gettext('Level'),
        path: 'loyalty.Level',
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
        name: gettext('EXP'),
        modification: 'customCurrency',
        currency: 'EXP',
        path: 'loyalty.Points',
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
        name: gettext('Freespins'),
        path: 'freespins',
        wlcElement: 'block_user-stat_freespins-count',
    },
};

export const defaultParams: IUserStatsCParams = {
    class: 'wlc-user-stats',
    moduleName: 'user',
    componentName: 'wlc-user-stats',
    fields: [
        'balance',
        'bonusBalance',
        'points',
        'level',
    ],
    showTooltipDescriptionModal: false,
};
