import {IMenuConfig} from '../interfaces/menu.interface';

export const menuConfig: IMenuConfig = {
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
                items: [
                    'mobile-menu:privacy-policy',
                    'mobile-menu:responsible-game',
                    'mobile-menu:fair-play',
                    'mobile-menu:games-rules',
                    'mobile-menu:terms-and-conditions',
                    'mobile-menu:contact-us',
                ],
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
    },
    profileMenu: {
        items: [
            'profile-menu:dashboard',
            'profile-menu:bonuses-as-offers',
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
};
