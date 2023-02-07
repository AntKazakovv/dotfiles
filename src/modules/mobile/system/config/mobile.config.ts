import {IMobileConfig} from '../interfaces/mobile.interface';

export const mobileConfig: IMobileConfig = {
    sidebarMenu: {
        items: [
            [
                'sidebar-menu:bonuses',
                {
                    parent: 'sidebar-menu:tournaments',
                    type: 'group',
                    items: [
                        'sidebar-menu:current-tournaments',
                        'sidebar-menu:active-tournaments',
                    ],
                },
                'sidebar-menu:deposit',
                'sidebar-menu:withdrawal',
                {
                    parent: 'sidebar-menu:history',
                    type: 'group',
                    items: [
                        'sidebar-menu:bonuses-history',
                        'sidebar-menu:bets-history',
                        'sidebar-menu:transactions-history',
                        'sidebar-menu:tournaments-history',
                    ],
                },
                'sidebar-menu:account-settings',
            ],
            [
                {
                    parent: 'sidebar-menu:info',
                    type: 'group',
                    items: [
                        'sidebar-menu:info-buttons',
                    ],
                },
                'sidebar-menu:language',
            ],
            [
                'sidebar-menu:logout',
            ],
        ],
    },
};
