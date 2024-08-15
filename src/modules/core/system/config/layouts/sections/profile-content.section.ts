import {
    ILayoutComponent,
    ILayoutSectionConfig,
    ITitleCParams,
} from 'wlc-engine/modules/core';
import {IWrapperCParams} from 'wlc-engine/modules/core/components';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

import * as componentLib from '../components';

const profileDefaultLoyaltyType = (isSingleLevels: boolean): ILayoutSectionConfig => {
    return {
        container: true,
        modifiers: isSingleLevels ? ['single-levels'] : null,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        isSingleLevels ? componentLib.wlcTitle.profileLoyalty : componentLib.wlcTitle.profileStore,
                        componentLib.wlcProfileMenu.submenu,
                        componentLib.wlcLoyaltyProgress.def,
                        componentLib.wlcLoyaltyLevels.def,
                        componentLib.wlcLoyaltyLevelsWp.def,
                    ],
                    smartSection: {
                        columns: [
                            'wlc-c-12',
                            'wlc-c-12',
                            'wlc-c-12 wlc-mb-smd',
                            'wlc-c-12 wlc-mb-xl',
                            'wlc-c-12',
                        ],
                    },
                },
            },
        ],
    };
};

const profileFirstLoyaltyType = (isSingleLevels: boolean): ILayoutSectionConfig => {
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
                        isSingleLevels
                            ? componentLib.wlcTitle.profileLoyalty
                            : componentLib.wlcTitle.profileStore,
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
                                    componentLib.wlcLoyaltyProgress.def,
                                    componentLib.wlcLoyaltyLevels.def,
                                    componentLib.wlcLoyaltyLevelsWp.def,
                                ],
                                smartSection: {
                                    columns: [
                                        'wlc-c-12 wlc-mb-smd',
                                        'wlc-c-12 wlc-mb-xl',
                                        'wlc-c-12',
                                    ],
                                },
                            },
                        },
                    ],
                },
            },
        ],
    };
};

const profileWolfLoyaltyType = (isSingleLevels: boolean): ILayoutSectionConfig => {
    return {
        container: true,
        theme: 'wolf',
        usePreloader: true,
        modifiers: isSingleLevels ? ['single-levels'] : null,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__top',
                                components: [
                                    {
                                        name: 'core.wlc-section-title',
                                        params: {
                                            theme: 'wolf',
                                            text: 'Loyalty',
                                            iconPath: 'wlc/icons/european/v3/loyalty.svg',
                                        },
                                        display: {
                                            before: 899,
                                        },
                                    },
                                ],
                            },
                        },
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcProfileMenu.submenuWolf,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                components: [
                                    componentLib.wlcLoyaltyProgress.def,
                                    componentLib.wlcLoyaltyLevels.def,
                                    componentLib.wlcLoyaltyLevelsWp.def,
                                ],
                                smartSection: {
                                    innerClasses: '',
                                    columns: [
                                        'wlc-c-12 wlc-mb-smd',
                                        'wlc-c-12 wlc-mb-xl',
                                        'wlc-c-12',
                                    ],
                                },
                            },
                        },
                    ],
                },
            },
        ],
    };
};

const profileDefaultLoyaltyProgram = (): ILayoutSectionConfig => {
    return {
        container: true,
        components: [
            componentLib.wlcTitle.profileLoyalty,
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcIconExpLpDescription.def,
        ],
    };
};

const profileFirstLoyaltyProgram = (): ILayoutSectionConfig => {
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
                        componentLib.wlcTitle.profileLoyalty,
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
                                    componentLib.wlcTitle.profileLoyaltyProgram,
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
                                    componentLib.wlcIconExpLpDescription.def,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };
};

const fundistIdComponent: IFormComponent = {
    name: 'core.wlc-wrapper',
    params: <IWrapperCParams>{
        components: [
            {name: 'user.wlc-fundist-user-id'},
        ],
    },
};

const defaultMainBody: IFormComponent = {
    name: 'core.wlc-wrapper',
    params: {
        class: 'wlc-profile-content__body',
        components: [
            componentLib.wlcProfileForm.def,
            {
                name: 'user.wlc-profile-blocks',
                display: {
                    after: 900,
                },
            },
        ],
    },
};

const defaultMainBodyWithNickAndIcon: IFormComponent = {
    name: 'core.wlc-wrapper',
    params: {
        class: 'wlc-profile-content__body-with-nick-icon',
        components: [
            componentLib.wlcProfileForm.def,
            {
                name: 'user.wlc-nickname-icon',
            },
            {
                name: 'user.wlc-profile-blocks',
                display: {
                    after: 1023,
                },
            },
        ],
    },
};

const firstMainBodyWithNickAndIcon: IFormComponent = {
    name: 'core.wlc-wrapper',
    params: {
        class: 'wlc-profile-content__wrp',
        components: [
            {
                name: 'core.wlc-title',
                params: {
                    customMod: ['profile'],
                    mainText: gettext('Profile picture and nickname'),
                },
            },
            {
                name: 'user.wlc-nickname-icon',
            },
        ],
    },
};

const dashboardPromoSection: ILayoutComponent = {
    name: 'core.wlc-wrapper',
    params: <IWrapperCParams>{
        class: 'wlc-dashboard__promo',
        components: [
            componentLib.wlcEnterPromocode.def,
            componentLib.wlcSeeAllBonuses.def,
        ],
    },
};

/** Generates dashboard layout config with/without deposit wager widget. Use smart sections */
const generateDashboard = (useDepositWager?: boolean): ILayoutSectionConfig => {
    const componentsNoWager: ILayoutComponent[] = [
        componentLib.wlcEnterPromocode.def,
        componentLib.wlcSeeAllBonuses.def,
    ];
    const componentsWager: ILayoutComponent[] = [
        componentLib.wlcEnterPromocode.def,
        componentLib.wlcDepositWager.def,
        componentLib.wlcSeeAllBonuses.def,
    ];
    const columnsNoWager: string[] = [
        'wlc-c-12 wlc-c-720-6',
        'wlc-c-12 wlc-c-720-6',
    ];
    const columnsWager: string[] = [
        'wlc-c-12 wlc-c-720-6 wlc-c-1200-4',
        'wlc-c-12 wlc-c-720-6 wlc-c-1200-4',
        'wlc-c-12 wlc-c-720-6 wlc-c-1200-4',
    ];
    const bottomLineComponents: ILayoutComponent[] = useDepositWager ? componentsWager : componentsNoWager;
    const bottomLineColumns: string[] = useDepositWager ? columnsWager : columnsNoWager;

    return {
        container: true,
        usePreloader: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'smart-dashboard__title',
                    components: [
                        {
                            name: 'core.wlc-title',
                            params: {
                                themeMod: 'third',
                                mainText: gettext('My dashboard'),
                            },
                        },
                        {
                            name: 'user.wlc-logout',
                            params: {
                                useText: true,
                            },
                            display: {
                                before: 899,
                            },
                        },
                    ],
                    smartSection: {
                        hostClasses: 'wlc-mb-sm',
                        innerClasses: 'wlc-gap-xs wlc-h-align-between',
                        columns: [
                            'wlc-c-8',
                            'wlc-c-auto',
                        ],
                    },
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'smart-dashboard__top',
                    components: [
                        componentLib.wlcDashboardLoyaltyBlock.def,
                        componentLib.wlcUserStats.dashboard,
                    ],
                    smartSection: {
                        hostClasses: 'wlc-mb-smd wlc-mb-1630-lg',
                        innerClasses: 'wlc-gap-smd wlc-gap-1366-md',
                        columns: [
                            'wlc-c-12 wlc-c-768-6',
                            'wlc-c-12 wlc-c-768-6',
                        ],
                    },
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'smart-dashboard__bonuses-title',
                    components: [
                        {
                            name: 'core.wlc-title',
                            params: {
                                themeMod: 'third',
                                mainText: gettext('My bonuses'),
                                wlcElement: 'header_user-bonuses',
                            },
                        },
                    ],
                    smartSection: {
                        hostClasses: 'wlc-mb-sm wlc-mb-1630-smd',
                    },
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'smart-dashboard__bonuses',
                    components: [
                        {
                            ...componentLib.wlcBonusesList.dashboardWithEars,
                            display: {
                                before: 1023,
                            },
                        },
                        {
                            ...componentLib.wlcBonusesList.dashboardWide,
                            display: {
                                after: 1024,
                            },
                        },
                    ],
                    smartSection: {
                        hostClasses: 'wlc-mb-xs wlc-mb-1630-lg',
                        innerClasses: 'wlc-gap-smd',
                        columns: [
                            'wlc-c-12',
                            'wlc-c-12',
                        ],
                    },
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'smart-dashboard__bottom',
                    components: bottomLineComponents,
                    smartSection: {
                        hostClasses: 'wlc-mb-lg',
                        innerClasses: 'wlc-gap-smd wlc-gap-1366-md',
                        columns: bottomLineColumns,
                    },
                },
            },
        ],
    };
};

/** Generates wolf dashboard layout config with/without deposit wager widget. Use smart sections */
const generateDashboardWolf = (useDepositWager?: boolean): ILayoutSectionConfig => {
    const componentsNoWager: ILayoutComponent[] = [
        componentLib.wlcEnterPromocode.wolf,
        componentLib.wlcSeeAllBonuses.wolf,
    ];
    const componentsWager: ILayoutComponent[] = [
        componentLib.wlcEnterPromocode.wolf,
        componentLib.wlcDepositWager.wolf,
        componentLib.wlcSeeAllBonuses.wolf,
    ];
    const columnsNoWager: string[] = [
        'wlc-c-12 wlc-c-640-6',
        'wlc-c-12 wlc-c-640-6',
    ];
    const columnsWager: string[] = [
        'wlc-c-12 wlc-c-640-6 wlc-c-1200-4',
        'wlc-c-12 wlc-c-640-6 wlc-c-1200-4',
        'wlc-c-12 wlc-c-768-6 wlc-c-1200-4',
    ];
    const bottomLineComponents: ILayoutComponent[] = useDepositWager ? componentsWager : componentsNoWager;
    const bottomLineColumns: string[] = useDepositWager ? columnsWager : columnsNoWager;

    return {
        container: true,
        theme: 'wolf',
        usePreloader: true,
        components: [
            {
                name: 'core.wlc-section-title',
                params: {
                    theme: 'wolf',
                    text: 'Dashboard',
                    iconPath: 'wlc/icons/european/v3/dashboard.svg',
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'smart-dashboard__top',
                                components: [
                                    componentLib.wlcDashboardLoyaltyBlock.wolf,
                                    componentLib.wlcUserStats.wolf,
                                ],
                                smartSection: {
                                    hostClasses: 'wlc-mb-lg',
                                    innerClasses: 'wlc-gap-smd wlc-gap-768-md',
                                    columns: [
                                        'wlc-c-12 wlc-c-640-6',
                                        'wlc-c-12 wlc-c-640-6',
                                    ],
                                },
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'smart-dashboard__bonuses',
                                components: [
                                    componentLib.wlcBonusesWolf.profileDashboardSlider,

                                ],
                                smartSection: {
                                    hostClasses: 'wlc-mb-lg',
                                },
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'smart-dashboard__bottom',
                                components: bottomLineComponents,
                                smartSection: {
                                    hostClasses: 'wlc-mb-lg',
                                    innerClasses: 'wlc-gap-smd wlc-gap-768-md',
                                    columns: bottomLineColumns,
                                },
                            },
                        },
                    ],
                },
            },
        ],
    };
};

const generateProfileWolf = (): ILayoutSectionConfig => ({
    container: true,
    theme: 'wolf',
    usePreloader: true,
    components: [
        {
            name: 'core.wlc-wrapper',
            params: {
                class: 'wlc-profile-content__top wlc-profile-content__top--buttons',
                components: [
                    {
                        name: 'core.wlc-section-title',
                        params: {
                            theme: 'wolf',
                            text: 'Profile',
                            iconPath: 'wlc/icons/european/v3/account-settings.svg',
                        },
                        display: {
                            before: 899,
                        },
                    },
                    componentLib.wlcButton.profileBlocksWolf,
                ],
            },
        },

        {
            name: 'core.wlc-wrapper',
            params: {
                class: 'wlc-profile-content__wrp',
                components: [
                    componentLib.wlcProfileMenu.defTypeWolf,
                    componentLib.wlcProfileMenu.submenuWolf,
                    {
                        name: 'core.wlc-wrapper',
                        params: {
                            class: 'wlc-profile-content__body',
                            components: [
                                componentLib.wlcProfileForm.def,
                                {
                                    name: 'user.wlc-profile-blocks',
                                    display: {
                                        after: 900,
                                    },
                                },
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

    export const generateProfileMain = (useFundistUserId: boolean, useNickAndIcon: boolean): ILayoutSectionConfig => ({
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
            ...(useFundistUserId ? [fundistIdComponent] : []),
            componentLib.wlcProfileMenu.submenu,
            ...(useNickAndIcon ? [defaultMainBodyWithNickAndIcon] : [defaultMainBody]),
        ],
    });

    export const generateProfileFirst = (useFundistUserId: boolean, useNickAndIcon: boolean): ILayoutSectionConfig => ({
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
                        ...(useNickAndIcon ? [firstMainBodyWithNickAndIcon] : []),
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

    /**
     * @deprecated
     */
    export const profileMain: ILayoutSectionConfig = generateProfileMain(false, false);

    /**
     * @deprecated
     */
    export const profileMainWithFundistUserId: ILayoutSectionConfig = generateProfileMain(true, false);

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

    /**
     * @deprecated
     */
    export const profileMainTypeFirst: ILayoutSectionConfig = generateProfileFirst(false, false);

    /**
     * @deprecated
     */
    export const profileFirstWithFundistUserId = generateProfileFirst(true, false);

    export const profileMainTypeWolf: ILayoutSectionConfig = generateProfileWolf();

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

    export const profileWolfHistory: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        usePreloader: true,
        components: [
            {
                name: 'core.wlc-section-title',
                params: {
                    theme: 'wolf',
                    text: 'History',
                    iconPath: 'wlc/icons/european/v3/history.svg',
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcTransactionHistory.filter,
                        componentLib.wlcTransactionHistory.def,
                    ],
                },
            },
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
                                    {
                                        name: 'finances.wlc-history-range',
                                        params: {
                                            type: 'submenu',
                                        },
                                    },
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
                        componentLib.wlcCounter.bonusesAll,
                    ],
                },
            },
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcBonusesList.main,
        ],
    };

    export const profileBonusesAll: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcTitle.bonuses,
                        componentLib.wlcCounter.bonusesAll,
                    ],
                },
            },
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcBonusesList.all,
        ],
    };

    export const profileWolfBonusesMain: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        usePreloader: true,
        components: [
            {
                name: 'core.wlc-section-title',
                params: {
                    theme: 'wolf',
                    text: 'Bonuses',
                    iconPath: 'wlc/icons/european/v3/bonuses.svg',
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcBonusesWolf.main,
                    ],
                },
            },
        ],
    };

    export const profileWolfBonusesOffers: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        usePreloader: true,
        components: [
            {
                name: 'core.wlc-section-title',
                params: {
                    theme: 'wolf',
                    text: 'Bonuses',
                    iconPath: 'wlc/icons/european/v3/bonuses.svg',
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcBonusesWolf.offers,
                    ],
                },
            },
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
                                    componentLib.wlcTitle.bonuses,
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
                                    },
                                    {
                                        ...componentLib.wlcBonusesList.activeFirstWithNoBonusItem,
                                        display: {
                                            configProperty: '$bonuses.unitedPageBonuses',
                                        },
                                    },
                                    {
                                        name: 'core.wlc-wrapper',
                                        params: {
                                            class: 'wlc-profile-content__header--second',
                                            components: [
                                                componentLib.wlcTitle.offers,

                                            ],
                                        },
                                        display: {
                                            configProperty: '$bonuses.unitedPageBonuses',
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

    export const profileBonusesActiveDef: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcTitle.bonuses,
                        componentLib.wlcCounter.bonusesAll,
                    ],
                },
            },
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcBonusesList.active,
        ],
    };

    export const profileBonusesActive: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.activeBonuses,
            componentLib.wlcBonusesList.activeFirst,
        ],
    };

    export const profileWolfBonusesActive: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        usePreloader: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcBonusesWolf.active,
                    ],
                },
            },
        ],
    };

    export const profileBonusesActiveTypeFirst = (recommendedWithEars: boolean): ILayoutSectionConfig => ({
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
                                    componentLib.wlcRecommendedBonuses.generateConfig(recommendedWithEars),
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    });

    export const profileBonusesInventory: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcTitle.bonuses,
                        componentLib.wlcCounter.bonusesAll,
                    ],
                },
            },
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcBonusesList.inventory,
        ],
    };

    export const profileWolfBonusesInventory: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        usePreloader: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcBonusesWolf.inventory,
                    ],
                },
            },
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
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.inventory,
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
                                    componentLib.wlcTitle.inventory,
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
                                    componentLib.wlcBonusesList.inventoryFirst,
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
        usePreloader: true,
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
            componentLib.wlcDepositWithdraw.deposit,
        ],
    };

    export const profileWolfDeposit: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        usePreloader: true,
        components: [
            {
                name: 'core.wlc-section-title',
                params: {
                    theme: 'wolf',
                    text: 'Deposit',
                    iconPath: 'wlc/icons/european/v3/deposit.svg',
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcDepositWithdraw.submenuWolf,
                        componentLib.wlcDepositWithdraw.deposit,
                    ],
                },
            },
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
        usePreloader: true,
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
            componentLib.wlcDepositWithdraw.withdraw,
        ],
    };

    export const profileWolfWithdraw: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        usePreloader: true,
        components: [
            {
                name: 'core.wlc-section-title',
                params: {
                    theme: 'wolf',
                    text: 'Withdrawal',
                    iconPath: 'wlc/icons/european/v3/withdrawal.svg',
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcDepositWithdraw.submenuWolf,
                        componentLib.wlcDepositWithdraw.withdraw,
                    ],
                },
            },
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
                                    componentLib.wlcDepositWithdraw.withdraw,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileTransfer: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcTitle.profileTransfer,
                    ],
                },
            },
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcTransfer.def,
        ],
    };

    export const profileWolfTransfer: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [componentLib.wlcTitle.paymentsWolf],
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcTransfer.def,
                    ],
                },
            },
        ],
    };

    export const profileTransferTypeFirst: ILayoutSectionConfig = {
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
                                class: 'wlc-profile-content__header',
                                components: [
                                    componentLib.wlcTitle.profileTransfer,
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
                                    componentLib.wlcTransfer.def,
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
        usePreloader: true,
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
            componentLib.wlcProfileMenu.submenuTransactionsHistory,
            componentLib.wlcTransactionHistory.def,
        ],
    };

    export const profileWolfTransactions: ILayoutSectionConfig = {
        container: true,
        usePreloader: true,
        theme: 'wolf',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__top',
                                components: [
                                    {
                                        name: 'core.wlc-section-title',
                                        params: {
                                            theme: 'wolf',
                                            text: 'History',
                                            iconPath: 'wlc/icons/european/v3/history.svg',
                                        },
                                        display: {
                                            before: 1023,
                                        },
                                    },
                                    {
                                        name: 'history.wlc-history-filter',
                                        params: {
                                            theme: 'wolf',
                                            config: 'transaction',
                                            iconPath: '/wlc/icons/filter-wolf.svg',
                                        },
                                        display: {
                                            before: 1023,
                                        },
                                    },
                                ],
                            },
                        },
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcTransactionHistory.def,
                    ],
                },
            },
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
                                    componentLib.wlcTitle.transactionsHistory,
                                    {
                                        name: 'finances.wlc-history-range',
                                        params: {
                                            type: 'submenu',
                                        },
                                    },
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
                                    {
                                        name: 'finances.wlc-history-range',
                                        params: {
                                            type: 'submenu',
                                        },
                                        display: {
                                            before: 1199,
                                        },
                                    },
                                    componentLib.wlcTransactionHistory.def,
                                ],
                            },
                        },
                    ],
                },
            },
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
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-dashboard__top',
                    components: [
                        componentLib.wlcDashboardLoyaltyBlock.def,
                        componentLib.wlcDashboardExchange.def,
                    ],
                },
            },
            componentLib.wlcTitle.profileDashboardBonuses,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-dashboard__bottom',
                    components: [
                        ...componentLib.wlcBonusesList.generateDashboardConfig(bonusesListSwiperWithEars),
                        dashboardPromoSection,
                    ],
                },
            },
        ],
    });

    export const profileDashboardWager: ILayoutSectionConfig = generateDashboard(true);
    export const profileDashboardNoWager: ILayoutSectionConfig = generateDashboard(false);

    export const wolfDashboardWager: ILayoutSectionConfig = generateDashboardWolf(true);
    export const wolfDashboardNoWager: ILayoutSectionConfig = generateDashboardWolf(false);

    /** TODO: replace that with new dashboard config */
    export const profileWolfDashboard: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        usePreloader: true,
        components: [
            {
                name: 'core.wlc-section-title',
                params: {
                    theme: 'wolf',
                    text: 'Dashboard',
                    iconPath: 'wlc/icons/european/v3/dashboard.svg',
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-dashboard__top',
                                components: [
                                    componentLib.wlcDashboardLoyaltyBlock.wolf,
                                    componentLib.wlcUserStats.wolf,
                                    componentLib.wlcEnterPromocode.wolf,
                                ],
                                smartSection: {
                                    hostClasses: 'wlc-mb-lg',
                                    innerClasses: 'wlc-gap-md',
                                    columns: [
                                        'wlc-c-12 wlc-c-768-6 wlc-c-1024-4',
                                        'wlc-c-12 wlc-c-768-6 wlc-c-1024-4',
                                        'wlc-c-12  wlc-c-768-6 wlc-c-1024-4',
                                    ],
                                },
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-dashboard__middle',
                                components: [
                                    componentLib.wlcBonusesWolf.profileDashboardSlider,

                                ],
                                smartSection: {
                                    hostClasses: 'wlc-mb-lg',
                                },
                            },
                        },
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
                    class: 'wlc-dashboard-grid',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-dashboard__top without-store',
                                components: [
                                    componentLib.wlcDashboardLoyaltyBlock.def,
                                    {
                                        name: 'user.wlc-user-stats',
                                        params: {
                                            useDepositBtn: false,
                                        },
                                    },
                                ],
                            },
                        },
                        componentLib.wlcTitle.profileDashboardBonuses,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-dashboard__bottom',
                                components: [
                                    componentLib.wlcBonusesList.dashboard,
                                    dashboardPromoSection,
                                ],
                            },
                        },
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

    export const profileWolfVerificationShuftiProKycaml: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        usePreloader: true,
        components: [
            {
                name: 'core.wlc-section-title',
                params: {
                    theme: 'wolf',
                    text: 'Profile',
                    iconPath: 'wlc/icons/european/v3/account-settings.svg',
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcVerification.shuftiProKycaml,
                    ],
                },
            },
        ],
    };

    export const profileVerificationShuftiProKycamlTypeFirst: ILayoutSectionConfig = {
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
                                    {
                                        name: 'core.wlc-title',
                                        display: {
                                            after: 1024,
                                        },
                                        params: <ITitleCParams>{
                                            customMod: ['profile'],
                                            mainText: gettext('KYC'),
                                            wlcElement: 'header_shufti-pro-kycaml',
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
                                    componentLib.wlcVerification.shuftiProKycaml,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileVerificationKycQuestionnaire: ILayoutSectionConfig = {
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
            componentLib.wlcVerification.kycQuestionnaire,
        ],
    };

    export const profileWolfVerificationKycQuestionnaire: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        usePreloader: true,
        components: [
            {
                name: 'core.wlc-section-title',
                params: {
                    theme: 'wolf',
                    text: 'Profile',
                    iconPath: 'wlc/icons/european/v3/account-settings.svg',
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcVerification.kycQuestionnaire,
                    ],
                },
            },
        ],
    };

    export const profileVerificationKycQuestionnaireTypeFirst: ILayoutSectionConfig = {
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
                                    {
                                        name: 'core.wlc-title',
                                        display: {
                                            after: 1024,
                                        },
                                        params: <ITitleCParams>{
                                            customMod: ['profile'],
                                            mainText: gettext('KYC questionnaire'),
                                            wlcElement: 'header_kyc-questionnaire',
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
                                    componentLib.wlcVerification.kycQuestionnaire,
                                ],
                            },
                        },
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

    export const profileWolfVerification: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        usePreloader: true,
        components: [
            {
                name: 'core.wlc-section-title',
                params: {
                    theme: 'wolf',
                    text: 'Profile',
                    iconPath: 'wlc/icons/european/v3/account-settings.svg',
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcVerification.themeWolf,
                    ],
                },
            },
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

    export const profileWolfLimitations: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        usePreloader: true,
        components: [
            {
                name: 'core.wlc-section-title',
                params: {
                    theme: 'wolf',
                    text: 'Profile',
                    iconPath: 'wlc/icons/european/v3/account-settings.svg',
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcLimitations.wolf,
                    ],
                },
            },
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
                                after: 1024,
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
            componentLib.wlcStoreTitle.def,
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
                        componentLib.wlcStoreTitle.def,
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
                                    componentLib.wlcStoreTitle.category,
                                ],
                            },
                            display: {
                                after: 1200,
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__stats',
                                components: [
                                    componentLib.wlcUserStats.store,
                                ],
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

    export const profileWolfStore: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        usePreloader: true,
        components: [
            {
                name: 'core.wlc-section-title',
                params: {
                    theme: 'wolf',
                    text: 'Store',
                    iconPath: 'wlc/icons/european/v3/market.svg',
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcUserStats.storeWithDescriptionIcon,
                        componentLib.wlcStoreList.wolf,
                    ],
                },
            },
        ],
    };

    export const profileLoyaltyLevels: ILayoutSectionConfig = profileDefaultLoyaltyType(false);
    export const profileLoyaltyLevelsSingle: ILayoutSectionConfig = profileDefaultLoyaltyType(true);

    export const profileLoyaltyLevelsTypeFirst: ILayoutSectionConfig = profileFirstLoyaltyType(false);
    export const profileLoyaltyLevelsTypeFirstSingle: ILayoutSectionConfig = profileFirstLoyaltyType(true);

    export const profileWolfLoyaltyLevelsSingle: ILayoutSectionConfig = profileWolfLoyaltyType(true);

    export const profileLoyaltyProgram: ILayoutSectionConfig = profileDefaultLoyaltyProgram();
    export const profileLoyaltyProgramTypeFirst: ILayoutSectionConfig = profileFirstLoyaltyProgram();

    export const profileAchievements: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcAchievementTitle.def,
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcAchievementsList.def,
        ],
    };

    export const profileWolfAchievements: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        components: [
            {
                name: 'core.wlc-section-title',
                params: {
                    theme: 'wolf',
                    text: 'Achievements',
                    iconPath: 'wlc/icons/european/v3/achievements.svg',
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcAchievementsList.wolf,
                    ],
                },
            },
        ],
    };

    export const profileAchievementsTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcAchievementTitle.def,
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
                                    componentLib.wlcAchievementTitle.group,
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
                                    componentLib.wlcAchievementsList.def,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileQuests: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcQuestsTitle.def,
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcQuestsTaskList.def,
        ],
    };

    export const profileWolfQuests: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        components: [
            {
                name: 'core.wlc-section-title',
                params: {
                    theme: 'wolf',
                    text: 'Quests',
                    iconPath: 'wlc/icons/european/v3/quests.svg',
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcQuestsTaskList.def,
                    ],
                },
            },
        ],
    };

    export const profileQuestsTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcQuestsTitle.def,
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
                                    componentLib.wlcQuestsTitle.state,
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
                                    componentLib.wlcQuestsTaskList.def,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileMessages: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcInternalMails.filter,
                    ],
                },
            },
            componentLib.wlcProfileMenu.submenuProfileMessages,
            componentLib.wlcInternalMails.mails,
        ],
    };

    export const profileWolfMessages: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        components: [
            {
                name: 'core.wlc-section-title',
                params: {
                    theme: 'wolf',
                    text: 'Profile',
                    iconPath: 'wlc/icons/european/v3/account-settings.svg',
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcProfileMenu.submenuWolf,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__top',
                                components: [
                                    componentLib.wlcInternalMails.filterOnly,
                                ],
                            },
                        },
                        componentLib.wlcInternalMails.mails,
                    ],
                },
            },
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
                        componentLib.wlcInternalMails.filterOnly,
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
        usePreloader: true,
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

    export const profileWolfBetHistory: ILayoutSectionConfig = {
        container: true,
        usePreloader: true,
        theme: 'wolf',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__top',
                                components: [
                                    {
                                        name: 'core.wlc-section-title',
                                        params: {
                                            theme: 'wolf',
                                            text: 'History',
                                            iconPath: 'wlc/icons/european/v3/history.svg',
                                        },
                                        display: {
                                            before: 1023,
                                        },
                                    },
                                    {
                                        name: 'history.wlc-history-filter',
                                        params: {
                                            theme: 'wolf',
                                            config: 'bet',
                                            iconPath: '/wlc/icons/filter-wolf.svg',
                                        },
                                        display: {
                                            before: 1023,
                                        },
                                    },
                                ],
                            },
                        },
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcBetHistory.def,
                    ],
                },
            },
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
                                    {
                                        name: 'finances.wlc-history-range',
                                        params: {
                                            type: 'submenu',
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
                                    {
                                        name: 'finances.wlc-history-range',
                                        params: {
                                            type: 'submenu',
                                        },
                                        display: {
                                            before: 1199,
                                        },
                                    },
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

    export const profileWolfBonusesHistory: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__top',
                                components: [
                                    {
                                        name: 'core.wlc-section-title',
                                        params: {
                                            theme: 'wolf',
                                            text: 'History',
                                            iconPath: 'wlc/icons/european/v3/history.svg',
                                        },
                                        display: {
                                            before: 1023,
                                        },
                                    },
                                    {
                                        name: 'history.wlc-history-filter',
                                        params: {
                                            theme: 'wolf',
                                            config: 'bonus',
                                            iconPath: '/wlc/icons/filter-wolf.svg',
                                        },
                                        display: {
                                            before: 1023,
                                        },
                                    },
                                ],
                            },
                        },
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcBonusesHistory.def,
                    ],
                },
            },
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

    export const profileOrdersHistory: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        componentLib.wlcOrdersHistory.filter,
                    ],
                },
            },
            componentLib.wlcProfileMenu.submenu,
            componentLib.wlcOrdersHistory.def,
        ],
    };

    export const profileOrdersHistoryTypeFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.ordersHistory,
                        componentLib.wlcOrdersHistory.filterTypeFirst,
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
                                    componentLib.wlcTitle.ordersHistory,
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
                                    componentLib.wlcOrdersHistory.def,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileWolfOrdersHistory: ILayoutSectionConfig = {
        container: true,
        usePreloader: true,
        theme: 'wolf',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__top wlc-profile-content__top--buttons',
                                components: [
                                    {
                                        name: 'core.wlc-section-title',
                                        params: {
                                            theme: 'wolf',
                                            text: 'History',
                                            iconPath: 'wlc/icons/european/v3/history.svg',
                                        },
                                        display: {
                                            before: 1023,
                                        },
                                    },
                                    componentLib.wlcOrdersHistory.filterOnly,
                                ],
                            },
                        },
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcOrdersHistory.wolf,
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

    export const profileWolfTournamentsDetail: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcTournamentDetail.def,
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

    export const profileWolfTournamentsHistory: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-profile-content__top',
                                components: [
                                    {
                                        name: 'core.wlc-section-title',
                                        params: {
                                            theme: 'wolf',
                                            text: 'History',
                                            iconPath: 'wlc/icons/european/v3/history.svg',
                                        },
                                        display: {
                                            before: 1023,
                                        },
                                    },
                                    {
                                        name: 'history.wlc-history-filter',
                                        params: {
                                            theme: 'wolf',
                                            config: 'tournaments',
                                            iconPath: '/wlc/icons/filter-wolf.svg',
                                        },
                                        display: {
                                            before: 1023,
                                        },
                                    },
                                ],
                            },
                        },
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcTournamentsHistory.wolf,
                    ],
                },
            },
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

    export const profileWolfSocials: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcProfileMenu.submenuWolf,
                        componentLib.wlcTitle.profileV2,
                        componentLib.wlcSocial.socialNetworksProfile,
                    ],
                },
            },
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

    export const profileCashbackRewards: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__top',
                    components: [
                        {
                            name: 'core.wlc-title',
                            params: {
                                customMod: ['profile'],
                                mainText: gettext('Cashback'),
                                wlcElement: 'header_cashback',
                            },
                            display: {
                                after: 1024,
                            },
                        },
                        componentLib.wlcCashbackHistory.filter,
                    ],
                },
            },
            componentLib.wlcCashbackRewards.def,
        ],
    };

    export const profileWolfCashbackRewards: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        components: [
            {
                name: 'core.wlc-section-title',
                params: {
                    theme: 'wolf',
                    text: 'Cashback',
                    iconPath: 'wlc/icons/european/v3/cashback.svg',
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcCashbackRewards.def,
                    ],
                },
            },
        ],
    };

    export const profileCashbackRewardsFirst: ILayoutSectionConfig = {
        container: true,
        theme: 'first',
        components: [
            componentLib.wlcProfileMenu.defTypeFirst,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__header',
                    components: [
                        componentLib.wlcTitle.cashback,
                        componentLib.wlcCashbackHistory.filterTypeFirst,
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
                                    componentLib.wlcTitle.cashback,
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
                                    componentLib.wlcCashbackRewards.first,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileReferral: ILayoutSectionConfig = {
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
                    components: [
                        {
                            name: 'referrals.wlc-referral-info',
                        },
                    ],
                },
            },
        ],
    };

    export const profileReferralTypeFirst: ILayoutSectionConfig = {
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
                                    componentLib.wlcTitle.referrals,
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
                                        name: 'referrals.wlc-referral-info',
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const profileWolfReferral: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        components: [
            {
                name: 'core.wlc-section-title',
                params: {
                    theme: 'wolf',
                    text: 'Profile',
                    iconPath: 'wlc/icons/european/v3/account-settings.svg',
                },
                display: {
                    before: 899,
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-profile-content__wrp',
                    components: [
                        componentLib.wlcProfileMenu.defTypeWolf,
                        componentLib.wlcProfileMenu.submenuWolf,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                components: [
                                    {
                                        name: 'referrals.wlc-referral-info',
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };
}
