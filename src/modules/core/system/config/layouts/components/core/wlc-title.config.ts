import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcTitle {
    export const promotions: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['promotions'],
            mainText: gettext('Promotions'),
            wlcElement: 'header_promotions',
        },
    };

    export const profile: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            mainText: gettext('Profile'),
            wlcElement: 'header_edit-profile',
        },
    };

    export const profileV2: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('Profile'),
            wlcElement: 'header_edit-profile',
        },
    };

    export const profileHistory: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('History'),
            wlcElement: 'header_history',
        },
    };

    export const bonuses: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('Bonuses'),
            wlcElement: 'header_bonuses',
        },
    };
    export const activeBonuses: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('Active bonuses'),
        },
    };
    export const inventory: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('Inventory'),
        },
    };

    export const transactionsHistory: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('Transactions history'),
            wlcElement: 'header_transactions-history',
        },
        display: {
            after: 1024,
        },
    };

    export const history: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('History'),
            wlcElement: 'header_transactions-history',
        },
    };

    export const profileDashboard: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('My dashboard'),
            wlcElement: 'header_dashboard',
        },
    };

    export const profileDashboardBonuses: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile', 'profile-bonuses'],
            mainText: gettext('My Bonuses'),
            wlcElement: 'header_user-bonuses',
        },
    };

    export const profileStore: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('Market'),
        },
    };
}
