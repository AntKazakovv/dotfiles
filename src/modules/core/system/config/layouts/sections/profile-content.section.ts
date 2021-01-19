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

    export const profileLoyalty: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.bonuses,
            componentLib.wlcBonusesList.main,
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
}
