import {
    ILayoutComponent,
} from 'wlc-engine/modules/core';
import {ITitleCParams} from 'wlc-engine/modules/core/components';

export namespace wlcTitle {
    export const promotions: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['promotions'],
            mainText: gettext('Promotions'),
            wlcElement: 'header_offers',
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

    export const profileV1: ILayoutComponent = {
        name: 'core.wlc-title',
        params: <ITitleCParams>{
            customMod: ['profile'],
            mainText: gettext('Profile'),
            wlcElement: 'header_edit-profile',
        },
    };

    export const myAccountV1: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('Profile'),
            wlcElement: 'header_my-account',
        },
    };

    export const profileV1Mobile: ILayoutComponent = {
        name: 'core.wlc-title',
        display: {
            before: 1023,
        },
        params: <ITitleCParams>{
            customMod: ['profile'],
            mainText: gettext('Profile'),
            wlcElement: 'header_edit-profile',
        },
    };

    export const cashV1Mobile: ILayoutComponent = {
        name: 'core.wlc-title',
        display: {
            before: 1199,
        },
        params: <ITitleCParams>{
            customMod: ['profile'],
            mainText: gettext('Cash'),
            wlcElement: 'header_edit-profile',
        },
    };

    export const cash: ILayoutComponent = {
        name: 'core.wlc-title',
        params: <ITitleCParams>{
            customMod: ['profile'],
            mainText: gettext('Cash'),
            wlcElement: 'header_edit-profile',
        },
    };

    export const verification: ILayoutComponent = {
        name: 'core.wlc-title',
        display: {
            after: 1024,
        },
        params: <ITitleCParams>{
            customMod: ['profile'],
            mainText: gettext('Verification'),
            wlcElement: 'header_verification',
        },
    };

    export const messages: ILayoutComponent = {
        name: 'core.wlc-title',
        params: <ITitleCParams>{
            customMod: ['profile'],
            mainText: gettext('Messages'),
            wlcElement: 'header_messages',
        },
    };

    export const socials: ILayoutComponent = {
        name: 'core.wlc-title',
        params: <ITitleCParams>{
            customMod: ['profile'],
            mainText: gettext('Social Networks'),
            wlcElement: 'header_socials',
        },
    };

    export const profileLimitations: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('Responsible gaming'),
            wlcElement: 'header_edit-limitations',
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

    export const betHistory: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('Bets history'),
            wlcElement: 'header_bet-history',
        },
    };

    export const gamblings: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('Gamblings'),
            wlcElement: 'header_bet-history',
        },
    };

    export const tournamentsHistory: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('Tournaments history'),
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

    export const bonusesV1Mobile: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('Bonuses'),
            wlcElement: 'header_bonuses',
        },
    };

    export const offers: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('Offers'),
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

    export const bonusesHistory: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('Bonuses history'),
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
            mainText: gettext('My bonuses'),
            wlcElement: 'header_user-bonuses',
        },
    };

    export const profileStore: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-profile-content__top',
            components: [
                {
                    name: 'core.wlc-title',
                    params: <ITitleCParams>{
                        customMod: ['profile'],
                        mainText: gettext('Store'),
                        wlcElement: 'header_store',
                    },
                },
            ],
        },
    };

    export const profileLoyalty: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-profile-content__top',
            components: [
                {
                    name: 'core.wlc-title',
                    params: <ITitleCParams>{
                        customMod: ['profile'],
                        mainText: gettext('Loyalty'),
                        wlcElement: 'header_loyalty',
                    },
                },
            ],
        },
    };

    export const profileLoyaltyProgram: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-profile-content__top',
            components: [
                {
                    name: 'core.wlc-title',
                    params: <ITitleCParams>{
                        customMod: ['profile'],
                        mainText: gettext('Loyalty Program'),
                        wlcElement: 'header_loyalty',
                    },
                },
            ],
        },
    };

    export const profileStoreV1: ILayoutComponent = {
        name: 'core.wlc-title',
        params: <ITitleCParams>{
            customMod: ['profile'],
            mainText: gettext('Store'),
            wlcElement: 'header_store',
        },
    };


    export const profileLoyaltyV1Single: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-profile-content__top',
            components: [
                {
                    name: 'core.wlc-title',
                    params: <ITitleCParams>{
                        customMod: ['profile'],
                        mainText: gettext('Levels'),
                        wlcElement: 'header_loyalty',
                    },
                },
            ],
        },
    };

    export const profileAchievements: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-profile-content__top',
            components: [
                {
                    name: 'core.wlc-title',
                    params: <ITitleCParams>{
                        customMod: ['profile'],
                        mainText: gettext('Achievements'),
                        wlcElement: 'header_achievements',
                    },
                },
            ],
        },
    };

    export const profileQuests: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-profile-content__top',
            components: [
                {
                    name: 'core.wlc-title',
                    params: <ITitleCParams>{
                        customMod: ['profile'],
                        mainText: gettext('Quests'),
                        wlcElement: 'header_quests',
                    },
                },
            ],
        },
    };

    export const totalJackpot: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            mainText: gettext('Total Jackpot'),
            wlcElement: 'header_total-jackpot',
        },
    };

    export const tournaments: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['tournaments'],
            mainText: gettext('Tournaments'),
            wlcElement: 'header_promo_tournaments',
        },
    };

    export const winnersSection: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            mainText: gettext('Winners'),
            wlcElement: 'header_winners',
        },
    };

    export const profileAvailableTournaments: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['available-tournaments'],
            mainText: gettext('Available tournaments'),
            wlcElement: 'header_tournaments',
        },
    };

    export const profileActiveTournaments: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['available-tournaments'],
            mainText: gettext('Active tournaments'),
            wlcElement: 'header_tournaments',
        },
    };

    export const profileCashDeposit: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('Deposit'),
            wlcElement: 'header_cash',
        },
    };

    export const profileCashWithdrawal: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('Withdrawal'),
            wlcElement: 'header_cash',
        },
    };

    export const cashback: ILayoutComponent = {
        name: 'core.wlc-title',
        params: {
            customMod: ['profile'],
            mainText: gettext('Cashback'),
            wlcElement: 'header_cashback',
        },
    };

    export const paymentsWolf: ILayoutComponent = {
        name: 'core.wlc-section-title',
        params: {
            theme: 'wolf',
            text: 'Payments',
            iconPath: 'wlc/icons/european/v3/payments.svg',
        },
    };

    export const profileTransfer: ILayoutComponent = {
        name: 'core.wlc-title',
        params: <ITitleCParams>{
            customMod: ['profile'],
            mainText: gettext('Gift for a friend'),
            wlcElement: 'header_transfer',
        },
    };

    export const referrals: ILayoutComponent = {
        name: 'core.wlc-title',
        params: <ITitleCParams>{
            customMod: ['profile'],
            mainText: gettext('Referral program'),
            wlcElement: 'header_messages',
        },
    };
}
