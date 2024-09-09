import {IMenuConfig} from '../interfaces/menu.interface';
import {$base} from 'wlc-config/01.base.config';

const loyaltySectionItems = $base.profile?.theme === 'wolf'
    ? ['profile-menu:loyalty-level-single']
    : ['profile-menu:loyalty-level-single', 'profile-menu:loyalty-program'];

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
            'main-menu:contact-us',
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
    panelMenu: {
        items: [
            'panel-menu:home',
            'panel-menu:categories',
            'panel-menu:promotions',
            'panel-menu:tournaments',
        ],
        itemsInfo: [
            'panel-menu:contacts',
            {
                type: 'group',
                parent: 'panel-menu:info',
                items: [],
            },
        ],
        icons: {
            folder: 'wlc/icons/european/v3',
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
            'profile-menu:cashback-rewards',
            {
                parent: 'profile-menu:cash',
                type: 'group',
                items: [
                    'profile-menu:cash-deposit',
                    'profile-menu:cash-withdrawal',
                    'profile-menu:cash-transfer',
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
                parent: 'profile-menu:bonuses-as-offers',
                type: 'group',
                items: [
                    'profile-menu:bonuses-all',
                    'profile-menu:bonuses-offers',
                    'profile-menu:bonuses-active',
                    'profile-menu:bonuses-inventory',
                ],
            },
            'profile-menu:market-with-categories',
            'profile-menu:achievements-with-groups',
            'profile-menu:quests-with-tasks',
            {
                parent: 'profile-menu:loyalty-section',
                type: 'group',
                items: loyaltySectionItems,
            },
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
                    'profile-menu:kyc-questionnaire',
                    'profile-menu:kycaml',
                    'profile-menu:limitations',
                    'profile-menu:messages',
                    'profile-menu:socials',
                    'profile-menu:referral',
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
                    'profile-first-menu:kyc-questionnaire',
                    'profile-first-menu:socials',
                    'profile-first-menu:limitations',
                    'profile-first-menu:messages',
                    'profile-first-menu:referral',
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
                    'profile-first-menu:tournaments-history',
                ],
            },
            {
                parent: 'profile-first-menu:cash',
                type: 'group',
                items: [
                    'profile-first-menu:cash-deposit',
                    'profile-first-menu:cash-withdrawal',
                    'profile-first-menu:cash-transfer',
                    'profile-first-menu:transaction-history',
                    'profile-first-menu:cashback-rewards',
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
            'profile-menu:achievements-with-groups',
            'profile-menu:quests-with-tasks',
            {
                parent: 'profile-menu:loyalty-section',
                type: 'group',
                items: [
                    'profile-menu:loyalty-level-single',
                    'profile-menu:loyalty-program',
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
    infoPageMenu: {
        items: [
            'info-page-menu:legal',
        ],
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
                    'profile-first-menu:kyc-questionnaire',
                    'profile-first-menu:socials',
                    'profile-first-menu:limitations',
                    'profile-first-menu:messages',
                    'profile-first-menu:referral',
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
            'profile-menu:achievements-with-groups',
            'profile-menu:quests-with-tasks',
            {
                parent: 'profile-menu:loyalty-section',
                type: 'group',
                items: [
                    'profile-menu:loyalty-level-single',
                    'profile-menu:loyalty-program',
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
                    'profile-first-menu:transaction-history',
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
            folder: 'wlc/icons/stickyFooter',
            use: false,
        },
    },
    mobileFooterMenu: {
        items: [
            'mobile-footer-menu:home',
            'mobile-footer-menu:games',
            'mobile-footer-menu:search',
            'mobile-footer-menu:menu',
        ],
        icons: {
            folder: 'mobile-app/icons',
            use: true,
        },
    },
};
