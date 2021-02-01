import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcTitle {
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
    };

    export const profileDashboard: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('My dashboard'),
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
}
