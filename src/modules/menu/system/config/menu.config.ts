import {IMenuConfig} from '../interfaces/menu.interface';

export const menuConfig: IMenuConfig = {
    fundist: {
        defaultMenuSettings: {
            use: false,
        },
    },
    mainMenu: {
        items: [
            'main-menu:home',
            'main-menu:promotions',
            'main-menu:tournaments',
            'main-menu:contacts',
        ],
        icons: {
            folder: 'wlc/icons/european/v1',
            use: false,
        },
    },
    categoryMenu: {
        icons: {
            folder: 'wlc/icons/european/v1',
            use: false,
        },
        lobbyBtn: {
            use: true,
        },
    },
    mobileMenu: {
        items: [
            'mobile-menu:sportsbook',
            'mobile-menu:promotions',
            'mobile-menu:tournaments',
            {
                parent: 'mobile-menu:info',
                type: 'group',
                items: [],
            },
        ],
        icons: {
            folder: 'wlc/icons/european/v1',
            use: false,
        },
        categoryIcons: {
            folder: 'wlc/icons/european/v1',
            use: true,
        },
        fundistMenuSettings: {
            itemsAfter: [
                {
                    type: 'page',
                    id: 'info',
                    order: 99999999,
                    device: 'all',
                },
            ],
        },
    },
    profileMenu: {
        items: [
            'profile-menu:dashboard',
            'profile-menu:bonuses-as-offers',
            {
                parent: 'profile-menu:loyalty',
                type: 'group',
                items: [
                    'profile-menu:loyalty-level-single',
                ],
            },
            {
                parent: 'profile-menu:market',
                type: 'group',
                items: [
                    'profile-menu:store',
                    'profile-menu:loyalty-level',
                ],
            },
            'profile-menu:cash-deposit',
            'profile-menu:cash-withdrawal',
            {
                parent: 'profile-menu:history',
                type: 'group',
                items: [
                    'profile-menu:bonuses-history',
                    'profile-menu:bets-history',
                    'profile-menu:transaction-history',
                    'profile-menu:tournaments-history',
                ],
            },
            {
                parent: 'profile-menu:account-settings',
                type: 'group',
                items: [
                    'profile-menu:edit-profile',
                    'profile-menu:verification',
                    'profile-menu:limitations',
                    'profile-menu:messages',
                    'profile-menu:socials',
                ],
            },
        ],
        icons: {
            folder: 'wlc/icons/european/v1',
            use: false,
        },
        subMenuIcons: {
            folder: 'wlc/icons/european/v1',
            use: false,
        },
        dropdownMenuIcons: {
            folder: 'wlc/icons/european/v1',
            use: false,
        },
    },
    profileFirstMenu: {
        items: [
            {
                parent: 'profile-first-menu:account-settings',
                type: 'group',
                items: [
                    'profile-first-menu:edit-profile',
                    'profile-first-menu:verification',
                    'profile-first-menu:socials',
                    'profile-first-menu:limitations',
                    'profile-first-menu:messages',
                ],
            },
            {
                parent: 'profile-first-menu:bonuses',
                type: 'group',
                items: [
                    'profile-first-menu:bonuses-as-offers',
                    'profile-first-menu:bonuses-active',
                    'profile-first-menu:bonuses-history',
                ],
            },
            {
                parent: 'profile-first-menu:tournaments',
                type: 'group',
                items: [
                    'profile-first-menu:tournaments-current',
                    'profile-first-menu:tournaments-active',
                    'profile-first-menu:tournaments-history',
                ],
            },
            {
                parent: 'profile-first-menu:cash',
                type: 'group',
                items: [
                    'profile-first-menu:cash-deposit',
                    'profile-first-menu:cash-withdrawal',
                    'profile-first-menu:transaction-history',
                ],
            },
            {
                parent: 'profile-first-menu:gamblings',
                type: 'group',
                items: [
                    'profile-first-menu:bets-history',
                ],
            },
            {
                parent: 'profile-menu:loyalty',
                type: 'group',
                items: [
                    'profile-menu:loyalty-level-single',
                ],
            },
            {
                parent: 'profile-first-menu:market',
                type: 'group',
                items: [
                    'profile-first-menu:store',
                    'profile-first-menu:loyalty-level',
                ],
            },
        ],
        icons: {
            folder: 'wlc/icons/european/v1',
            use: false,
        },
        subMenuIcons: {
            folder: 'wlc/icons/european/v1',
            use: false,
        },
        dropdownMenuIcons: {
            folder: 'wlc/icons/european/v1',
            use: false,
        },
    },
    affiliatesMenu: {
        items: [
            'affiliates-menu:commission',
            'affiliates-menu:why-us',
            'affiliates-menu:faq',
            'affiliates-menu:tc',
        ],
    },
    burgerPanel: {
        left: {
            headerMenu: {
                use: true,
                enableByFundistMenuSettings: true,
                menuParams: {
                    type: 'burger-panel-header-menu',
                    items: [],
                    common: {
                        useSwiper: false,
                    },
                },
                icons: {
                    folder: 'wlc/icons/categories/v2',
                },
                items: [
                    'burger-panel-header-menu:lobby',
                    'burger-panel-header-menu:favourites',
                    'burger-panel-header-menu:lastplayed',
                ],
            },
        },
    },
};
