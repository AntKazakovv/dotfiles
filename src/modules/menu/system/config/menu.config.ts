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
    mainMenuKiosk: {
        items: [
            'main-menu:home',
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
            'mobile-menu:categories',
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
            'profile-menu:market-with-categories',
            {
                parent: 'profile-menu:loyalty-section',
                type: 'group',
                items: [
                    'profile-menu:loyalty-level-single',
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
                    'profile-menu:kycaml',
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
                    'profile-first-menu:kycaml',
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
                    'profile-first-menu:bonuses-inventory',
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
            'profile-menu:market-with-categories',
            {
                parent: 'profile-menu:loyalty-section',
                type: 'group',
                items: [
                    'profile-menu:loyalty-level-single',
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

    profileFirstMenuUnitedBonuses: {
        items: [
            {
                parent: 'profile-first-menu:account-settings',
                type: 'group',
                items: [
                    'profile-first-menu:edit-profile',
                    'profile-first-menu:verification',
                    'profile-first-menu:kycaml',
                    'profile-first-menu:socials',
                    'profile-first-menu:limitations',
                    'profile-first-menu:messages',
                ],
            },
            {
                parent: 'profile-first-menu:bonuses',
                type: 'group',
                items: [
                    'profile-first-menu:bonuses-all',
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
            'profile-menu:market-with-categories',
            {
                parent: 'profile-menu:loyalty-section',
                type: 'group',
                items: [
                    'profile-menu:loyalty-level-single',
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

    profileKioskMenu: {
        items: [
            {
                parent: 'profile-kiosk-menu:account-settings',
                type: 'sref',
                items: [
                    'profile-kiosk-menu:edit-profile',
                ],
            },
            {
                parent: 'profile-first-menu:gamblings',
                type: 'group',
                items: [
                    'profile-first-menu:bets-history',
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
            'affiliates-menu:testimonials',
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
        right: {
            headerMenu: {
                use: 'auto',
                menuParams: {
                    type: 'burger-panel-header-menu',
                    items: [],
                    common: {
                        useSwiper: false,
                    },
                },
                icons: {
                    folder: 'wlc/icons/notifier',
                },
                items: [
                    'burger-panel-header-menu:profile-messages',
                ],
            },
        },
    },
    stickyFooter: {
        items: [
            'sticky-footer:menu',
            'sticky-footer:casino',
            'sticky-footer:livecasino',
            'sticky-footer:login',
            'sticky-footer:signup',
            'sticky-footer:deposit',
            'sticky-footer:profile',
        ],
        icons: {
            folder: 'wlc/icons',
            use: false,
        },
    },
};

