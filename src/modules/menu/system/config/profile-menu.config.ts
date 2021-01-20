import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as ProfileMenuParams from 'wlc-engine/modules/menu/components/profile-menu/profile-menu.params';

export const wlcProfileMenuItemsGlobal: MenuParams.IMenuItemsGlobal = {
    'profile-menu:my-account': {
        name: gettext('My account'),
        class: 'my-account',
        type: 'title',
        params: {
            state: {
                parent: 'app.profile.main',
                name: 'app.profile.main.info',
                params: {},
            },
        },
    },
    'profile-menu:account-settings': {
        name: gettext('Account settings'),
        class: 'account-settings             ',
        type: 'title',
        params: {
            state: {
                parent: 'app.profile.main',
                name: 'app.profile.main.info',
                params: {},
            },
        },
    },
    'profile-menu:edit-profile': {
        name: gettext('General'),
        type: 'sref',
        icon: 'icons/edit-profile',
        class: 'edit-profile',
        params: {
            state: {
                name: 'app.profile.main.info',
                params: {},
            },
        },
    },
    'profile-menu:socials': {
        name: gettext('Social networks'),
        type: 'sref',
        icon: 'icons/socials',
        class: 'socials',
        params: {
            state: {
                parent: 'app.profile',
                name: 'app.profile.social',
                params: {},
            },
        },
    },
    'profile-menu:bonuses': {
        name: gettext('Bonuses'),
        type: 'title',
        class: 'bonuses',
        params: {
            state: {
                parent: 'app.profile.loyalty-bonuses',
                name: 'app.profile.loyalty-bonuses.main',
                params: {},
            },
        },
    },
    'profile-menu:bonuses-as-offers': {
        name: gettext('Bonuses'),
        type: 'sref',
        class: 'bonuses',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.main',
                params: {},
            },
        },
    },
    'profile-menu:bonuses-offers': {
        name: gettext('Offers'),
        type: 'sref',
        icon: 'icons/bonuses-offers',
        class: 'bonuses-offers',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.main',
                params: {},
            },
        },
    },
    'profile-menu:bonuses-active': {
        name: gettext('Active bonuses'),
        type: 'sref',
        icon: 'icons/active-bonus',
        class: 'active-bonus',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.active',
                params: {},
            },
        },
    },
    'profile-menu:bonuses-inventory': {
        name: gettext('Inventory'),
        type: 'sref',
        icon: 'icons/inventory-bonus',
        class: 'inventory-bonus',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.inventory',
                params: {},
            },
        },
    },
    'profile-menu:bonuses-history': {
        name: gettext('History'),
        type: 'sref',
        icon: 'icons/bonuses-history',
        class: 'bonuses-history',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.history',
                params: {},
            },
        },
    },
    'profile-menu:bonuses-voucher': {
        name: gettext('Voucher'),
        type: 'sref',
        icon: 'icons/bonuses-voucher',
        class: 'bonuses-voucher',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.promo',
                params: {},
            },
        },
    },
    'profile-menu:bonuses-system': {
        name: gettext('Bonuses system'),
        type: 'sref',
        icon: 'icons/bonuses-system',
        class: 'bonuses-system',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.system',
                params: {},
            },
        },
    },
    'profile-menu:tournaments': {
        name: gettext('Tournaments'),
        type: 'title',
        class: 'tournaments',
        params: {
            state: {
                parent: 'app.profile.loyalty-tournaments',
                name: 'app.profile.loyalty-tournaments.main',
                params: {},
            },
        },
    },
    'profile-menu:tournaments-current': {
        name: gettext('Current tournaments'),
        type: 'sref',
        icon: 'icon/tournaments-current',
        class: 'tournaments-current',
        params: {
            state: {
                name: 'app.profile.loyalty-tournaments.main',
                params: {},
            },
        },
    },
    'profile-menu:tournaments-active': {
        name: gettext('Active tournaments'),
        type: 'sref',
        icon: 'icons/tournaments-active',
        class: 'tournaments-active',
        params: {
            state: {
                name: 'app.profile.loyalty-tournaments.active',
                params: {},
            },
        },
    },
    'profile-menu:tournaments-history': {
        name: gettext('Tournaments history'),
        type: 'sref',
        icon: 'icons/tournaments-history',
        class: 'tournaments-history',
        params: {
            state: {
                name: 'app.profile.loyalty-tournaments.history',
                params: {},
            },
        },
    },
    'profile-menu:store': {
        name: gettext('Store'),
        type: 'title',
        class: 'store',
        params: {
            state: {
                parent: 'app.profile.loyalty-store',
                name: 'app.profile.loyalty-store.main',
                params: {},
            },
        },
    },
    'profile-menu:store-main': {
        name: gettext('Store'),
        type: 'sref',
        icon: 'icons/store-main',
        class: 'store-main',
        params: {
            state: {
                name: 'app.profile.loyalty-store.main',
                params: {},
            },
        },
    },
    'profile-menu:store-orders': {
        name: gettext('Store orders'),
        type: 'sref',
        icon: 'icons/store-orders',
        class: 'store-orders',
        params: {
            state: {
                name: 'app.profile.loyalty-store.orders',
                params: {},
            },
        },
    },
    'profile-menu:cash': {
        name: gettext('Cash'),
        type: 'title',
        class: 'cash',
        params: {
            state: {
                parent: 'app.profile.cash',
                name: 'app.profile.cash.deposit',
                params: {},
            },
        },
    },
    'profile-menu:cash-deposit': {
        name: gettext('Deposit'),
        type: 'sref',
        icon: 'icons/deposit',
        class: 'deposit',
        params: {
            state: {
                name: 'app.profile.cash.deposit',
                params: {},
            },
        },
    },
    'profile-menu:cash-withdrawal': {
        name: gettext('Withdrawal'),
        type: 'sref',
        icon: 'icons/withdrawal',
        class: 'withdrawal',
        params: {
            state: {
                name: 'app.profile.cash.withdraw',
                params: {},
            },
        },
    },
    'profile-menu:cash-wallet': {
        name: gettext('Wallet'),
        type: 'sref',
        icon: 'icons/wallet',
        class: 'wallet',
        params: {
            state: {
                name: 'app.profile.cash.wallet',
                params: {},
            },
        },
    },
    'profile-menu:transaction-history': {
        name: gettext('Transaction history'),
        type: 'sref',
        icon: 'icons/transaction-history',
        class: 'transaction-history',
        params: {
            state: {
                name: 'app.profile.cash.transactions',
                params: {},
            },
        },
    },
    'profile-menu:gamblings': {
        name: gettext('Gamblings'),
        type: 'title',
        class: 'gamblings',
        params: {
            state: {
                parent: 'app.profile.gamblings',
                name: 'app.profile.gamblings.bets',
                params: {},
            },
        },
    },
    'profile-menu:bets-history': {
        name: gettext('Bets history'),
        type: 'sref',
        icon: 'icons/bonus-history',
        class: 'bonus-history',
        params: {
            state: {
                name: 'app.profile.gamblings.bets',
                params: {},
            },
        },
    },
    'profile-menu:messages': {
        name: gettext('Messages'),
        type: 'sref',
        icon: 'icons/messages',
        class: 'messages',
        params: {
            state: {
                name: 'app.profile.messages',
                params: {},
            },
        },
    },
    'profile-menu:logout': {
        name: gettext('Logout'),
        type: 'modal',
        icon: 'icons/logout',
        class: 'logout',
        params: {
            modal: {
                name: 'logout',
            },
        },
    },
    'profile-menu:verification': {
        name: gettext('Verification'),
        type: 'sref',
        icon: 'icons/verification',
        class: 'verification',
        params: {
            state: {
                name: 'app.profile.verification',
                params: {},
            },
        },
    },
    'profile-menu:password': {
        name: gettext('Password'),
        type: 'sref',
        icon: 'icons/password',
        class: 'password',
        params: {
            state: {
                name: 'app.profile.password',
                params: {},
            },
        },
    },
    'profile-menu:notifications': {
        name: gettext('Notifications'),
        type: 'sref',
        icon: 'icons/notifications',
        class: 'notifications',
        params: {
            state: {
                name: 'app.profile.notifications',
                params: {},
            },
        },
    },
    'profile-menu:payments': {
        name: gettext('Payments'),
        type: 'sref',
        icon: 'icons/payments',
        class: 'payments',
        params: {
            state: {
                name: 'app.profile.payments',
                params: {},
            },
        },
    },
    'profile-menu:limits': {
        name: gettext('Limits'),
        type: 'sref',
        icon: 'icons/limits',
        class: 'limits',
        params: {
            state: {
                name: 'app.profile.limits',
                params: {},
            },
        },
    },
    'profile-menu:open-bets': {
        name: gettext('Open bets'),
        type: 'sref',
        icon: 'icons/active-bonus',
        class: 'active-bonus',
        params: {
            state: {
                name: 'app.sportsbook',
                params: {
                    action: 'show-open-bets',
                },
            },
        },
        // sref: (this.appConfig.mobile) ? 'app.sportsbook({page: "history"})' : 'app.sportsbook({action: "show-open-bets"})',
    },
    'profile-menu:loyalty-level': {
        name: gettext('Loyalty'),
        type: 'sref',
        icon: 'icons/loyalty-levels',
        class: 'loyalty-levels',
        params: {
            state: {
                name: 'app.profile.loyalty-level',
                params: {},
            },
        },
    },
    'profile-menu:referrals': {
        name: gettext('Referrals'),
        type: 'sref',
        icon: 'icons/referrals',
        class: 'referrals',
        params: {
            state: {
                name: 'app.profile.referrals',
                params: {},
            },
        },
    },
    'profile-menu:dashboard': {
        name: gettext('Dashboard'),
        type: 'sref',
        icon: 'icons/dashboard',
        class: 'dashboard',
        params: {
            state: {
                name: 'app.profile.dashboard',
                params: {},
            },
        },
    },
    'profile-menu:market': {
        name: gettext('Market'),
        type: 'title',
        class: 'market',
    },
};

export const wlcProfileMenuItemsDefault: MenuParams.MenuConfigItem[] = [
    'profile-menu:dashboard',
    'profile-menu:bonuses-as-offers',
    'profile-menu:cash-deposit',
    'profile-menu:cash-withdrawal',
    'profile-menu:transaction-history',
    {
        parent: 'profile-menu:account-settings',
        items: [
            'profile-menu:edit-profile',
            'profile-menu:verification',
            'profile-menu:messages',
        ],
    },
    // {
    //     parent: 'profile-menu:tournaments',
    //     items: [
    //         'profile-menu:tournaments-current',
    //         'profile-menu:tournaments-active',
    //         'profile-menu:tournaments-history',
    //     ],
    // },
    // {
    //     parent: 'profile-menu:cash',
    //     items: [
    //         'profile-menu:cash-deposit',
    //         'profile-menu:cash-withdrawal',
    //         'profile-menu:cash-wallet',
    //         'profile-menu:transaction-history',
    //     ],
    // },
    // {
    //     parent: 'profile-menu:gamblings',
    //     items: [
    //         'profile-menu:loyalty-level',
    //         'profile-menu:bets-history',
    //     ],
    // },
    // {
    //     parent: 'profile-menu:store',
    //     items: [
    //         'profile-menu:store-main',
    //         'profile-menu:store-orders',
    //     ],
    // },
    // {
    //     parent: 'profile-menu:bonuses',
    //     items: [
    //         'profile-menu:bonuses-offers',
    //         'profile-menu:bonuses-active',
    //         'profile-menu:bonuses-inventory',
    //         'profile-menu:bonuses-history',
    //         'profile-menu:bonuses-voucher',
    //         'profile-menu:bonuses-system',
    //     ],
    // },
    // 'profile-menu:referrals',
    // 'profile-menu:logout',
];

export const profileMenuFilter: ProfileMenuParams.IProfileMenuFilter[] = [
    {
        config: '$base.profile.messages.use',
        item: 'profile-menu:messages',
    },
    {
        config: '$base.profile.verification.use',
        item: 'profile-menu:verification',
    },
    {
        config: '$base.tournaments.use',
        item: 'profile-menu:tournaments',
    },
    {
        config: '$base.profile.bonuses.system.use',
        item: 'profile-menu:bonuses-system',
    },
    {
        config: '$base.profile.bonuses.inventory.use',
        item: 'profile-menu:bonuses-inventory',
    },
    {
        config: '$base.profile.store.use',
        item: 'profile-menu:store',
    },
    {
        config: '$base.profile.referrals.use',
        item: 'profile-menu:referrals',
    },
    {
        config: '$base.profile.dashboard.use',
        item: 'profile-menu:dashboard',
    },
    {
        config: '$base.profile.wallet.use',
        item: 'profile-menu:cash-wallet',
    },
];
