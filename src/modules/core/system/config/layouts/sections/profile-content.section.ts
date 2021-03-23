import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace profileContent {
    export const empty: ILayoutSectionConfig = {
        container: true,
        components: [
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

    export const profileHistory: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTransactionHistory.filter,
            componentLib.wlcProfileMenu.submenuHistory,
            componentLib.wlcTransactionHistory.def,
        ],
    };

    export const profileBonusesMain: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.bonuses,
            componentLib.wlcCounter.bonuses,
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
            componentLib.wlcDepositWithdraw.balance,
            componentLib.wlcDepositWithdraw.submenu,
            componentLib.wlcDepositWithdraw.deposit,
        ],
    };

    export const profileWithdraw: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcDepositWithdraw.balance,
            componentLib.wlcDepositWithdraw.submenu,
            componentLib.wlcDepositWithdraw.withdraw,
        ],
    };

    export const profileTransactions: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTransactionHistory.filter,
            componentLib.wlcProfileMenu.submenuHistory,
            componentLib.wlcTransactionHistory.def,
        ],
    };

    export const profileDashboard: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.profileDashboard,
            componentLib.wlcLogout.useText,
            componentLib.wlcDashboardLoyaltyBlock.def,
            componentLib.wlcDashboardExchange.def,
            componentLib.wlcTitle.profileDashboardBonuses,
            componentLib.wlcBonusesList.dashboard,
            componentLib.wlcEnterPromocode.def,
            componentLib.wlcSeeAllBonuses.def,
        ],
    };

    export const profileVerification: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.profileV2,
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcVerification.def,
        ],
    };

    export const profileLimitations: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.profileLimitations,
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcLimitations.def,
        ],
    };

    export const profileStore: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.profileStore,
            componentLib.wlcUserStats.store,
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcStoreList.def,
        ],
    };

    export const profileLoyaltyLevels: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.profileStore,
            componentLib.wlcLoyaltyProgress.market,
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcLoyaltyLevels.def,
        ],
    };

    export const profileBetHistory: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcBetHistory.filter,
            componentLib.wlcProfileMenu.submenuBetHistory,
            componentLib.wlcBetHistory.def,
        ],
    };

    export const profileBonusesHistory: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcBonusesHistory.filter,
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcBonusesHistory.def,
        ],
    };

    export const profileTournamentsDetail: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTournamentDetail.def,
        ],
    };

    export const profileTournaments: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTournamentList.def,
        ],
    };
}
