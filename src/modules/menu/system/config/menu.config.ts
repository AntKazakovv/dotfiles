import {IMenuConfig} from '../interfaces/menu.interface';

export const menuConfig: IMenuConfig = {
    mainMenu: [
        'main-menu:promotions',
        'main-menu:contacts',
    ],
    mobileMenu: [
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
    profileMenu: [
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
};
