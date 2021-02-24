import {IMenuConfig} from '../interfaces/menu.interface';

export const menuConfig: IMenuConfig = {
    mainMenu: {
        items: [
            'main-menu:promotions',
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
            {
                parent: 'mobile-menu:info',
                items: [
                    'mobile-menu:privacy-policy',
                    'mobile-menu:responsible-game',
                    'mobile-menu:fair-play',
                    'mobile-menu:games-rules',
                    'mobile-menu:terms-and-conditions',
                ],
            },
        ],
        icons: {
            folder: 'wlc/icons/european/v1',
            use: false,
        },
        categoryIcons: {
            folder: 'wlc/icons/european/v1',
            use: false,
        },
    },
    profileMenu: {
        items: [
            'profile-menu:dashboard',
            'profile-menu:bonuses-as-offers',
            'profile-menu:store',
            'profile-menu:cash-deposit',
            'profile-menu:cash-withdrawal',
            {
                parent: 'profile-menu:history',
                items: [
                    'profile-menu:bonuses-history',
                    'profile-menu:bets-history',
                    'profile-menu:transaction-history',
                    'profile-menu:tournaments-history',
                ],
            },
            {
                parent: 'profile-menu:account-settings',
                items: [
                    'profile-menu:edit-profile',
                    'profile-menu:verification',
                    'profile-menu:messages',
                ],
            },
        ],
        icons: {
            folder: 'wlc/icons/european/v1',
            use: false,
        },
    },
};
