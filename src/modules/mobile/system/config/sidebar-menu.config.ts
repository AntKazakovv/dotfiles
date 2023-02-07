import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export const wlcSidebarMenuItemsGlobal: MenuParams.IMenuItemsGlobal = {
    'sidebar-menu:dashboard': {
        name: gettext('Dashboard'),
        type: 'sref',
        auth: true,
        icon: 'dashboard',
        class: 'dashboard',
        params: {
            state: {
                name: 'app.profile.dashboard',
                params: {},
            },
        },
    },
    'sidebar-menu:bonuses': {
        name: gettext('Bonuses'),
        type: 'sref',
        auth: true,
        class: 'bonuses',
        icon: 'bonuses',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.main',
                params: {},
            },
        },
    },
    'sidebar-menu:bonuses-offers': {
        name: gettext('Offers'),
        type: 'sref',
        icon: 'bonuses-offers',
        class: 'bonuses-offers',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.main',
                params: {},
            },
        },
    },
    'sidebar-menu:bonuses-voucher': {
        name: gettext('Voucher'),
        type: 'sref',
        icon: 'bonuses-voucher',
        class: 'bonuses-voucher',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.promo',
                params: {},
            },
        },
    },
    'sidebar-menu:bonuses-active': {
        name: gettext('Active bonuses'),
        type: 'sref',
        icon: 'active-bonuses',
        class: 'active-bonus',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.active',
                params: {},
            },
        },
        wlcElement: 'link_active',
    },
    'sidebar-menu:tournaments': {
        name: gettext('Tournaments'),
        type: 'sref',
        auth: true,
        icon: 'current-tournaments',
        class: 'tournaments-current',
        params: {
            state: {
                name: 'app.profile.loyalty-tournaments.main',
                params: {},
            },
        },
    },
    'sidebar-menu:tournaments-first-profile': {
        name: gettext('Tournaments'),
        type: 'sref',
        auth: true,
        icon: 'tournaments',
        class: 'tournaments',
        params: {
            state: {
                name: 'app.menu.item',
                params: {
                    item: 'tournaments',
                },
            },
        },
    },
    'sidebar-menu:current-tournaments': {
        name: gettext('Current tournaments'),
        type: 'sref',
        auth: true,
        icon: 'current-tournaments',
        class: 'tournaments-current',
        params: {
            state: {
                name: 'app.profile.loyalty-tournaments.main',
                params: {},
            },
        },
    },
    'sidebar-menu:active-tournaments': {
        name: gettext('Active tournaments'),
        type: 'sref',
        auth: true,
        icon: 'active-tournaments',
        class: 'tournaments-active',
        params: {
            state: {
                name: 'app.profile.loyalty-tournaments.active',
                params: {},
            },
        },
    },
    'sidebar-menu:market': {
        name: gettext('Market'),
        type: 'sref',
        auth: true,
        icon: 'market',
        class: 'market',
        params: {
            state: {
                name: 'app.profile.loyalty-store.main',
                params: {},
            },
        },
    },
    'sidebar-menu:deposit': {
        name: gettext('Deposit'),
        type: 'sref',
        auth: true,
        class: 'deposit',
        params: {
            state: {
                name: 'app.profile.cash.deposit',
                params: {},
            },
        },
    },
    'sidebar-menu:deposit-href': {
        name: gettext('Deposit'),
        type: 'href',
        auth: true,
        class: 'deposit',
        params: {
            href: {
                url: '/profile/cash',
                jwtToken: true,
                baseSiteUrl: true,
            },
        },
    },
    'sidebar-menu:withdrawal': {
        name: gettext('Withdrawal'),
        type: 'sref',
        auth: true,
        class: 'withdrawal',
        params: {
            state: {
                name: 'app.profile.cash.withdraw',
                params: {},
            },
        },
    },
    'sidebar-menu:withdrawal-href': {
        name: gettext('Withdrawal'),
        type: 'href',
        auth: true,
        class: 'withdrawal',
        params: {
            href: {
                url: '/profile/cash/withdraw',
                jwtToken: true,
                baseSiteUrl: true,
            },
        },
    },
    'sidebar-menu:extras': {
        name: gettext('Extras'),
        type: 'sref',
        auth: true,
        class: 'bonuses',
        icon: 'bonuses',
        params: {
            state: {
                name: 'app.menu.item',
                params: {
                    item: 'extras',
                },
            },
        },
    },
    'sidebar-menu:history': {
        name: gettext('History'),
        type: 'sref',
        auth: true,
        icon: 'history',
        class: 'history',
        params: {
            state: {
                name: 'app.menu.item',
                params: {
                    item: 'history',
                },
            },
        },
    },
    'sidebar-menu:bonuses-history': {
        name: gettext('Bonuses history'),
        type: 'sref',
        auth: true,
        icon: 'bonuses-history',
        class: 'bonuses-history',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.history',
                params: {},
            },
        },
    },
    'sidebar-menu:bets-history': {
        name: gettext('Bets history'),
        type: 'sref',
        auth: true,
        icon: 'bets-history',
        class: 'bonus-history',
        params: {
            state: {
                name: 'app.profile.gamblings.bets',
                params: {},
            },
        },
    },
    'sidebar-menu:transactions-history': {
        name: gettext('Transactions history'),
        type: 'sref',
        auth: true,
        icon: 'transaction-history',
        class: 'transaction-history',
        params: {
            state: {
                name: 'app.profile.cash.transactions',
                params: {},
            },
        },
    },
    'sidebar-menu:tournaments-history': {
        name: gettext('Tournaments history'),
        type: 'sref',
        auth: true,
        icon: 'tournaments-history',
        class: 'tournaments-history',
        params: {
            state: {
                name: 'app.profile.loyalty-tournaments.history',
                params: {},
            },
        },
    },
    'sidebar-menu:account-settings': {
        name: gettext('Account settings'),
        type: 'sref',
        auth: true,
        class: 'my-account',
        icon: 'my-account',
        params: {
            state: {
                name: 'app.profile.main.info',
                params: {},
            },
        },
    },
    'sidebar-menu:info': {
        name: gettext('Info'),
        type: 'sref',
        icon: 'info',
        class: 'info',
        params: {
            state: {
                name: 'app.menu.item',
                params: {
                    item: 'info',
                },
            },
        },
    },
    'sidebar-menu:contact-us': {
        name: gettext('Contacts'),
        type: 'sref',
        icon: 'contact-us',
        class: 'info',
        params: {
            state: {
                name: 'app.contacts',
                params: {
                    slug: 'feedback',
                },
            },
        },
    },
    'sidebar-menu:info-buttons': {
        name: gettext('Info'),
        type: 'wordpress',
        params: {
            wp: {
                slug: ['legal'],
                defaultState: 'app.contacts',
                defaultType: 'sref',
                exclude: ['contacts'],
            },
        },
        icon: 'info-buttons',
        class: 'info-buttons',
    },
    'sidebar-menu:language': {
        name: gettext('Language'),
        type: 'sref',
        icon: 'language',
        class: 'language',
        params: {
            state: {
                name: 'app.language',
                params: {},
            },
        },
    },
    'sidebar-menu:logout': {
        name: gettext('Logout'),
        type: 'event',
        auth: true,
        icon: 'logout',
        class: 'logout',
        params: {
            event: {
                name: 'LOGOUT_CONFIRM',
            },
        },
    },
    'sidebar-menu:limits': {
        name: gettext('Limits'),
        type: 'sref',
        auth: true,
        icon: 'limits',
        class: 'limits',
        params: {
            state: {
                name: 'app.profile.limits',
                params: {},
            },
        },
    },
    'sidebar-menu:limitations': {
        name: gettext('Limitations'),
        type: 'sref',
        auth: true,
        icon: 'limitations',
        class: 'limitations',
        params: {
            state: {
                name: 'app.profile.limitations',
                params: {},
            },
        },
    },
    'sidebar-menu:faq': {
        name: gettext('FAQ'),
        type: 'sref',
        class: 'faq',
        params: {
            state: {
                name: 'app.contacts',
                params: {
                    slug: 'faq',
                },
            },
        },
    },
};
