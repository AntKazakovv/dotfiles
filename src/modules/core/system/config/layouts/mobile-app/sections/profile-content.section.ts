import {
    ILayoutSectionConfig,
} from 'wlc-engine/modules/core';
import {IWrapperCParams} from 'wlc-engine/modules/core/components';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

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

// const profileFirstLoyaltyType = (isSingleLevels: boolean) => {
//     return {
//         container: true,
//         theme: 'first',
//         components: [
//             componentLib.wlcProfileMenu.defTypeFirst,
//             {
//                 name: 'core.wlc-wrapper',
//                 params: {
//                     class: 'wlc-profile-content__header',
//                     components: [
//                         isSingleLevels
//                             ? componentLib.wlcTitle.profileLoyaltyV1Single
//                             : componentLib.wlcTitle.profileStore,
//                         {
//                             ...componentLib.wlcLoyaltyProgress.def,
//                             display: {
//                                 after: 640,
//                             },
//                         },
//                     ],
//                 },
//                 display: {
//                     before: 1199,
//                 },
//             },
//             componentLib.wlcProfileMenu.subMenuV1,
//             {
//                 name: 'core.wlc-wrapper',
//                 params: {
//                     class: 'wlc-profile-content parent',
//                     components: [
//                         {
//                             name: 'core.wlc-wrapper',
//                             params: {
//                                 class: 'wlc-profile-content__header underlined',
//                                 components: [
//                                     isSingleLevels ? componentLib.wlcTitle.profileLoyaltyV1Single
//                                         : componentLib.wlcTitle.profileLoyalty,
//                                     componentLib.wlcLoyaltyProgress.def,
//                                 ],
//                             },
//                             display: {
//                                 after: 1200,
//                             },
//                         },
//                         {
//                             name: 'core.wlc-wrapper',
//                             params: {
//                                 class: 'wlc-profile-content__body',
//                                 components: [
//                                     componentLib.wlcLoyaltyProgress.market,
//                                     componentLib.wlcLoyaltyLevels.def,
//                                 ],
//                             },
//                         },
//                     ],
//                 },
//             },
//         ],
//     };
// };

const fundistIdComponent: IFormComponent = {
    name: 'core.wlc-wrapper',
    params: <IWrapperCParams>{
        components: [
            {name: 'user.wlc-fundist-user-id'},
        ],
    },
};

const generateProfileMain = (useFundistUserId: boolean): ILayoutSectionConfig => ({
    container: true,
    theme: 'mobile-app',
    components: [
        ...(useFundistUserId ? [fundistIdComponent] : []),
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
});

const generateProfileFirst = (useFundistUserId: boolean): ILayoutSectionConfig => ({
    container: true,
    theme: 'first',
    components: [
        componentLib.wlcProfileMenu.defTypeFirst,
        {
            name: 'core.wlc-wrapper',
            params: {
                class: 'wlc-profile-content__header',
                components: [
                    {
                        name: 'core.wlc-wrapper',
                        params: {
                            components: [
                                componentLib.wlcTitle.myAccountV1,
                                ...(useFundistUserId ? [fundistIdComponent] : []),
                            ],
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
                class: 'wlc-profile-content',
                components: [
                    {
                        name: 'core.wlc-wrapper',
                        params: {
                            class: 'wlc-profile-content__header underlined',
                            components: [
                                {
                                    name: 'core.wlc-wrapper',
                                    params: {
                                        components: [
                                            componentLib.wlcTitle.profileV1,
                                            ...(useFundistUserId ? [fundistIdComponent] : []),
                                        ],
                                    },
                                },
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
                                componentLib.wlcProfileForm.def,
                            ],
                        },
                    },
                ],
            },
        },
    ],
});

export namespace profileContent {
    export const empty: ILayoutSectionConfig = {
        container: true,
        components: [
        ],
    };

    export const profileMain: ILayoutSectionConfig = generateProfileMain(false);

    export const profileMainTypeFirst: ILayoutSectionConfig = generateProfileFirst(false);

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
            componentLib.wlcBonusesList.main,
        ],
    };

    export const profileBonusesActive: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcBonusesList.active,
        ],
    };

    export const profileBonusesInventory: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcBonusesList.inventory,
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
                        // componentLib.wlcTitle.profileCashDeposit,
                    ],
                },
            },
            componentLib.wlcDepositWithdraw.submenu,
            componentLib.wlcDepositWithdraw.balanceAdaptive,
            componentLib.wlcDepositWithdraw.deposit,
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
                        // componentLib.wlcTitle.profileCashWithdrawal,
                    ],
                },
            },
            componentLib.wlcDepositWithdraw.submenu,
            componentLib.wlcDepositWithdraw.balanceAdaptive,
            componentLib.wlcDepositWithdraw.withdraw,
        ],
    };

    export const profileTransactions: ILayoutSectionConfig = {
        container: true,
        theme: 'mobile-app',
        components: [
            componentLib.wlcTransactionHistory.def,
        ],
    };

    export const profileDashboard = (bonusesListSwiperWithEars: boolean): ILayoutSectionConfig => ({
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
                        ...componentLib.wlcBonusesList.generateDashboardConfig(bonusesListSwiperWithEars),
                        componentLib.wlcEnterPromocode.def,
                        componentLib.wlcSeeAllBonuses.def,
                    ],
                },
            },
        ],
    });

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

    export const profileVerificationShuftiProKycaml: ILayoutSectionConfig = {
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
            componentLib.wlcVerification.shuftiProKycaml,
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

    export const profileStore: ILayoutSectionConfig = {
        container: true,
        usePreloader: true,
        components: [
            componentLib.wlcStoreTitle.def,
            componentLib.wlcUserStats.storeWithDescriptionIcon,
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcStoreList.def,
        ],
    };

    export const profileStoreMob: ILayoutSectionConfig = {
        container: true,
        usePreloader: true,
        components: [
            componentLib.wlcUserStats.storeWithDescriptionIconMob,
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcStoreList.def,
        ],
    };

    export const profileLoyaltyLevels: ILayoutSectionConfig = profileDefaultLoyaltyType(false);
    export const profileLoyaltyLevelsSingle: ILayoutSectionConfig = profileDefaultLoyaltyType(true);

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

    export const profileBetHistory: ILayoutSectionConfig = {
        container: true,
        theme: 'mobile-app',
        components: [
            componentLib.wlcBetHistory.def,
        ],
    };

    export const profileVoucher: ILayoutSectionConfig = {
        container: true,
        theme: 'mobile-app',
        components: [
            componentLib.wlcEnterPromocode.def,
        ],
    };

    export const profileBonusesHistory: ILayoutSectionConfig = {
        container: true,
        theme: 'mobile-app',
        components: [
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

    export const profileTournamentsHistory: ILayoutSectionConfig = {
        container: true,
        theme: 'mobile-app',
        components: [
            componentLib.wlcTournamentsHistory.def,
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
}
