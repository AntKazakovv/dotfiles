import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace profileContent {
    export const empty: ILayoutSectionConfig = {
        container: true,
        components: [
        ],
    };

    export const profileDashboard: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcEnterPromocode.def,
            componentLib.wlcSeeAllBonuses.def,
        ],
    };

    export const profileMain: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.profileV2,
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcProfileForm.def,
        ],
    };

    export const profileBonusesMain: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.bonuses,
            componentLib.wlcBonusesList.main,
        ],
    };

    export const profileBonusesActive: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.activeBonuses,
            componentLib.wlcBonusesList.active,
        ],
    };

    export const profileBonusesInventory: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.inventory,
            componentLib.wlcBonusesList.inventory,
        ],
    };

    export const profileDeposit: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcDepositWithdraw.deposit,
        ],
    };

    export const profileWithdraw: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcDepositWithdraw.withdraw,
        ],
    };

    export const profileTransactions: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.transactionsHistory,
            componentLib.wlcTransactionHistory.def,
        ],
    };

    export const profileDashboard: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.profileDashboard,
            componentLib.wlcLogout.def,
            componentLib.wlcDashboardLoyaltyBlock.def,
            componentLib.wlcDashboardExchange.def,
        ],
    };
}
