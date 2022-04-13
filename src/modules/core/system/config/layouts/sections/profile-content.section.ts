import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

const profileDefaultLoyaltyType = (isSingleLevels: boolean) => {
    return {
        container: true,
        modifiers: isSingleLevels ? ['single-levels'] : null,
        components: [
            isSingleLevels ? componentLib.wlcTitle.profileLoyalty : componentLib.wlcTitle.profileStore,
            componentLib.wlcLoyaltyProgress.def,
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcLoyaltyLevels.def,
        ],
    };
};

const profileFirstLoyaltyType = (isSingleLevels: boolean) => {
    return {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        isSingleLevels ? componentLib.wlcTitle.profileLoyalty : componentLib.wlcTitle.profileStore,
                        {
                            ...componentLib.wlcLoyaltyProgress.def,
                            display: {
                                after: 640,
                            },
                        },
                    ],
                },
                display: {
                    before: 1199,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content parent',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    isSingleLevels ? componentLib.wlcTitle.profileLoyaltyV1Single
                                        : componentLib.wlcTitle.profileLoyalty,
                                    componentLib.wlcLoyaltyProgress.def,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcLoyaltyProgress.market,
                                    componentLib.wlcLoyaltyLevels.def,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };
};

export namespace profileContent {
    export const empty: ILayoutSectionConfig = {
        container: true,
        components: [
        ],
    };

    export const profileMain: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top wlc-profile-content__top--buttons',
                    components: [
                        componentLib.wlcTitle.profileV2,
                        componentLib.wlcButton.profileBlocks,
                    ],
                },
            },
            componentLib.wlcProfileMenu.submenu,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__body',
                    components: [
                        componentLib.wlcProfileForm.def,
                        {
                            name: 'user.wlc-profile-blocks',
                            display: {
                                after: 1023,
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileTypeFirstTabletMenu: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                ...componentLib.wlcProfileMenu.def,
                display: {
                    before: 1199,
                    after: 900,
                },
            },
        ],
    };

    export const profileMainTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.myAccountV1,
                    ],
                },
                display: {
                    before: 1199,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.profileV1,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcProfileForm.generateConfig(),
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileMainTypeFirstWithLogin: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.myAccountV1,
                    ],
                },
                display: {
                    before: 1199,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.profileV1,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcProfileForm.generateConfig(true),
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileMainTypeKiosk: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.myAccountV1,
                    ],
                },
                display: {
                    before: 899,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.profileV1,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcProfileForm.kiosk,
                                ],
                            },
                        },
                    ],
                },
            },
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

    export const profileHistoryTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content header-inside',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.history,
                                    componentLib.wlcTransactionHistory.filterOnly,
                                ],
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcTransactionHistory.def,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileBonusesMain: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcTitle.bonuses,
                        componentLib.wlcCounter.bonuses,
                    ],
                },
            },
            componentLib.wlcBonusesList.main,
        ],
    };

    export const profileBonusesMainTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.bonuses,
                        componentLib.wlcEnterPromocode.hideTitleV1,
                    ],
                },
                display: {
                    before: 1199,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.offers,
                                    componentLib.wlcEnterPromocode.hideTitle,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    {
                                        name: 'core.wlc-wrapper',
                                        params: {
                                            class: 'wlc-profile-content__promocode',
                                            components: [
                                                componentLib.wlcEnterPromocode.hideTitle,
                                            ],
                                        },
                                        display: {
                                            before: 559,
                                        },
                                    },
                                    componentLib.wlcBonusesList.mainFirst,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileBonusesActive: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.activeBonuses,
            componentLib.wlcBonusesList.active,
        ],
    };

    export const profileBonusesActiveTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.bonusesV1Mobile,
                    ],
                },
                display: {
                    before: 1199,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.activeBonuses,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcRecommendedBonuses.def,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileBonusesInventory: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.inventory,
            componentLib.wlcBonusesList.inventory,
        ],
    };

    export const profileBonusesInventoryTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content header-inside',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.inventory,
                                ],
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcBonusesList.inventory,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileDeposit: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcTitle.profileCashDeposit,
                    ],
                },
            },
            componentLib.wlcDepositWithdraw.submenu,
            componentLib.wlcDepositWithdraw.balanceAdaptive,
            componentLib.wlcDepositWithdraw.deposit,
        ],
    };

    export const profileDepositTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.cash,
                    ],
                },
                display: {
                    before: 1199,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.profileCashDeposit,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcDepositWithdraw.balanceAdaptive,
                                    componentLib.wlcDepositWithdraw.deposit,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileWithdraw: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcTitle.profileCashWithdrawal,
                    ],
                },
            },
            componentLib.wlcDepositWithdraw.submenu,
            componentLib.wlcDepositWithdraw.balanceAdaptive,
            componentLib.wlcDepositWithdraw.withdraw,
        ],
    };

    export const profileWithdrawTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.cash,
                    ],
                },
                display: {
                    before: 1199,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.profileCashWithdrawal,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcDepositWithdraw.balanceAdaptive,
                                    componentLib.wlcDepositWithdraw.withdraw,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileTransactions: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcTransactionHistory.filter,
                    ],
                },
            },
            componentLib.wlcProfileMenu.submenuHistory,
            componentLib.wlcTransactionHistory.def,
        ],
    };

    export const profileTransactionsTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.cash,
                        componentLib.wlcTransactionHistory.filterOnly,
                    ],
                },
                display: {
                    before: 1199,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.history,
                                    componentLib.wlcTransactionHistory.filterOnly,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcTransactionHistory.def,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileDashboard: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcTitle.profileDashboard,
                        componentLib.wlcLogout.useText,
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-dashboard-grid',
                    components: [
                        componentLib.wlcDashboardLoyaltyBlock.def,
                        componentLib.wlcDashboardExchange.def,
                        componentLib.wlcTitle.profileDashboardBonuses,
                        componentLib.wlcBonusesList.dashboard,
                        componentLib.wlcEnterPromocode.def,
                        componentLib.wlcSeeAllBonuses.def,
                    ],
                },
            },
        ],
    };

    export const profileDashboardWithoutStore: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcTitle.profileDashboard,
                        componentLib.wlcLogout.useText,
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-dashboard-grid without-store',
                    components: [
                        componentLib.wlcDashboardLoyaltyBlock.def,
                        {
                            name: 'user.wlc-user-stats',
                            params: {
                                useDepositBtn: false,
                            },
                        },
                        componentLib.wlcTitle.profileDashboardBonuses,
                        componentLib.wlcBonusesList.dashboard,
                        componentLib.wlcEnterPromocode.def,
                        componentLib.wlcSeeAllBonuses.def,
                    ],
                },
            },
        ],
    };

    export const profileDashboardTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
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
                },
            },
        ],
    };

    export const profileVerification: ILayoutSectionConfig = {
        container: true,
        usePreloader: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcTitle.profileV2,
                    ],
                },
            },
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcVerification.def,
        ],
    };

    export const profileVerificationTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.myAccountV1,
                    ],
                },
                display: {
                    before: 1199,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.verification,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcVerification.def,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileLimitations: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcTitle.profileV2,
                    ],
                },
            },
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcLimitations.def,
        ],
    };

    export const profileLimitationsTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.profileLimitations,
                    ],
                },
                display: {
                    before: 1023,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header',
                                components: [
                                    componentLib.wlcTitle.profileLimitations,
                                ],
                            },
                            display: {
                                after: 1023,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcLimitations.def,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileStore: ILayoutSectionConfig = {
        container: true,
        usePreloader: true,
        components: [
            componentLib.wlcTitle.profileStore,
            componentLib.wlcUserStats.storeWithDescriptionIcon,
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcStoreList.def,
        ],
    };

    export const profileStoreTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.profileStore,
                        componentLib.wlcUserStats.store,
                    ],
                },
                display: {
                    before: 1199,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content parent',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.profileStoreV1,
                                    componentLib.wlcUserStats.store,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcStoreList.first,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileLoyaltyLevels: ILayoutSectionConfig = profileDefaultLoyaltyType(false);
    export const profileLoyaltyLevelsSingle: ILayoutSectionConfig = profileDefaultLoyaltyType(true);

    export const profileLoyaltyLevelsTypeFirst: ILayoutSectionConfig = profileFirstLoyaltyType(false);
    export const profileLoyaltyLevelsTypeFirstSingle: ILayoutSectionConfig = profileFirstLoyaltyType(true);

    export const profileMessages: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcTitle.profileV2,
                    ],
                },
            },
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcInternalMails.mails,
        ],
    };

    export const profileMessagesTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.myAccountV1,
                    ],
                },
                display: {
                    before: 1199,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.messages,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcInternalMails.mails,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileBetHistory: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcBetHistory.filter,
                    ],
                },
            },
            componentLib.wlcProfileMenu.submenuBetHistory,
            componentLib.wlcBetHistory.def,
        ],
    };

    export const profileBetHistoryTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.gamblings,
                        componentLib.wlcBetHistory.filterOnly,
                    ],
                },
                display: {
                    before: 1199,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.betHistory,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcBetHistory.def,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileBetHistoryTypeKiosk: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.gamblings,
                        componentLib.wlcBetHistory.filterOnly,
                    ],
                },
                display: {
                    before: 899,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.betHistory,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcBetHistory.def,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileBonusesHistory: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcBonusesHistory.filter,
                    ],
                },
            },
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcBonusesHistory.def,
        ],
    };

    export const profileBonusesHistoryTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.bonuses,
                        componentLib.wlcBonusesHistory.filterOnlyV1,
                    ],
                },
                display: {
                    before: 1199,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.bonusesHistory,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcBonusesHistory.def,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileTournamentsDetail: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTournamentDetail.def,
        ],
    };

    export const profileTournamentsDetailTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        componentLib.wlcTournamentList.detail,
                    ],
                },
            },
        ],
    };

    export const profileTournamentsActiveTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.tournaments,
                    ],
                },
                display: {
                    before: 1199,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.profileActiveTournaments,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcTournamentList.active,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileTournaments: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTournamentList.def,
        ],
    };

    export const profileTournamentsTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.tournaments,
                    ],
                },
                display: {
                    before: 1199,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.profileAvailableTournaments,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcTournamentList.availableFirst,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileTournamentsHistory: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcTournamentsHistory.filterTypeDefault,
                    ],
                },
            },
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcTournamentsHistory.def,
        ],
    };

    export const profileTournamentsHistoryTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.tournaments,
                        componentLib.wlcTournamentsHistory.filterTypeFirst,
                    ],
                },
                display: {
                    before: 1199,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.tournamentsHistory,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcTournamentsHistory.def,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileSocials: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.profileV2,
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcSocial.socialNetworksProfile,
        ],
    };

    export const profileSocialsFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.myAccountV1,
                    ],
                },
                display: {
                    before: 1023,
                },
            },
            componentLib.wlcProfileMenu.subMenuV1,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__header underlined',
                                components: [
                                    componentLib.wlcTitle.socials,
                                ],
                            },
                            display: {
                                after: 1024,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__body',
                                components: [
                                    componentLib.wlcSocial.socialNetworksProfile,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };
}
