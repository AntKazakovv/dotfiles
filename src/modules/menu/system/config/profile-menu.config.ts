import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as ProfileMenuParams from 'wlc-engine/modules/menu/components/profile-menu/profile-menu.params';

const profileLoyaltyMenuItem: MenuParams.IMenuItem = {
    name: gettext('Loyalty'),
    type: 'sref',
    icon: 'loyalty-levels',
    class: 'loyalty-levels',
    wlcElement: 'link_loyalty-level',
    params: {
        state: {
            name: 'app.profile.loyalty-level',
            params: {},
        },
    },
};

export const wlcProfileMenuItemsGlobal: MenuParams.IMenuItemsGlobal = {
    'profile-menu:my-account': {
        name: gettext('My account'),
        class: 'my-account',
        type: 'title',
        icon: 'my-account',
        params: {
            state: {
                parent: 'app.profile.main',
                name: 'app.profile.main.info',
                params: {},
            },
        },
    },
    'profile-first-menu:my-account': {
        name: gettext('My account'),
        class: 'my-account',
        type: 'title',
        icon: 'my-account',
        params: {
            state: {
                parent: 'app.profile.main',
                name: 'app.profile.main.info',
                params: {},
            },
        },
    },

    'profile-menu:account-settings': {
        name: gettext('Account Settings'),
        class: 'account-settings',
        type: 'sref',
        icon: 'account-settings',
        wlcElement: 'link_cc-profile-menu_account-settings',
        params: {
            state: {
                parent: [
                    'app.profile.main',
                    'app.profile.verification',
                    'app.profile.kycaml',
                    'app.profile.messages',
                    'app.profile.limitations',
                    'app.profile.social',
                ],
                name: 'app.profile.main.info',
                params: {},
            },
        },
    },
    'profile-first-menu:account-settings': {
        name: gettext('Account Settings'),
        class: 'account-settings',
        type: 'sref',
        icon: 'account-settings',
        wlcElement: 'link_cc-profile-menu_account-settings',
        params: {
            blockExpand: true,
            state: {
                parent: [
                    'app.profile.main',
                    'app.profile.verification',
                    'app.profile.kycaml',
                    'app.profile.messages',
                    'app.profile.limitations',
                    'app.profile.social',
                ],
                name: 'app.profile.main.info',
                params: {},
            },
        },
    },
    'profile-kiosk-menu:account-settings': {
        name: gettext('My account'),
        class: 'account-settings',
        type: 'sref',
        icon: 'account-settings',
        wlcElement: 'link_cc-profile-menu_account-settings',
        params: {
            blockExpand: true,
            state: {
                parent: [
                    'app.profile.main',
                ],
                name: 'app.profile.main.info',
                params: {},
            },
        },
    },

    'profile-menu:edit-profile': {
        name: gettext('General'),
        type: 'sref',
        icon: 'edit-profile',
        wlcElement: 'link_edit-profile',
        class: 'edit-profile',
        params: {
            state: {
                name: 'app.profile.main.info',
                params: {},
            },
        },
    },
    'profile-first-menu:edit-profile': {
        name: gettext('General'),
        type: 'sref',
        icon: 'edit-profile',
        wlcElement: 'link_edit-profile',
        class: 'edit-profile',
        params: {
            state: {
                name: 'app.profile.main.info',
                params: {},
            },
        },
    },
    'profile-kiosk-menu:edit-profile': {
        name: gettext('Profile'),
        type: 'sref',
        icon: 'edit-profile',
        wlcElement: 'link_edit-profile',
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
        icon: 'socials',
        class: 'socials',
        params: {
            state: {
                name: 'app.profile.social',
                params: {},
            },
        },
    },
    'profile-first-menu:socials': {
        name: gettext('Social networks'),
        type: 'sref',
        icon: 'socials',
        class: 'socials',
        params: {
            state: {
                name: 'app.profile.social',
                params: {},
            },
        },
    },

    'profile-menu:bonuses': {
        name: gettext('Bonuses'),
        type: 'title',
        class: 'bonuses',
        icon: 'bonuses',
        params: {
            state: {
                parent: 'app.profile.loyalty-bonuses',
                name: 'app.profile.loyalty-bonuses.main',
                params: {},
            },
        },
    },
    'profile-first-menu:bonuses': {
        name: gettext('Bonuses'),
        type: 'title',
        class: 'bonuses',
        icon: 'bonuses',
        params: {
            blockExpand: true,
            state: {
                parent: 'app.profile.loyalty-bonuses',
                name: 'app.profile.loyalty-bonuses.main',
                params: {},
            },
        },
    },

    'profile-menu:bonuses-as-offers': {
        name: gettext('Bonuses'),
        counterParams: {
            type: 'bonuses-main',
        },
        type: 'sref',
        class: 'bonuses',
        icon: 'bonuses',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.main',
                params: {},
            },
        },
        wlcElement: 'link_offers',
    },
    'profile-first-menu:bonuses-as-offers': {
        name: gettext('Offers'),
        type: 'sref',
        class: 'bonuses',
        icon: 'bonuses',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.main',
                params: {},
            },
        },
        wlcElement: 'link_offers',
    },

    'profile-menu:bonuses-offers': {
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
    'profile-first-menu:bonuses-offers': {
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

    'profile-menu:bonuses-active': {
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
    'profile-first-menu:bonuses-active': {
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
    'profile-first-menu:bonuses-all': {
        name: gettext('My bonuses'),
        type: 'sref',
        icon: 'active-bonuses',
        class: 'active-bonus',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.all',
                params: {},
            },
        },
    },

    'profile-menu:bonuses-inventory': {
        name: gettext('Inventory'),
        type: 'sref',
        icon: 'inventory-bonuses',
        class: 'inventory-bonus',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.inventory',
                params: {},
            },
        },
    },
    'profile-first-menu:bonuses-inventory': {
        name: gettext('Inventory'),
        type: 'sref',
        icon: 'inventory-bonuses',
        class: 'inventory-bonus',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.inventory',
                params: {},
            },
        },
    },

    'profile-menu:bonuses-history': {
        name: gettext('Bonuses history'),
        type: 'sref',
        icon: 'bonuses-history',
        class: 'bonuses-history',
        wlcElement: 'link_bonuses-history',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.history',
                params: {},
            },
        },
    },
    'profile-first-menu:bonuses-history': {
        name: gettext('Bonuses history'),
        type: 'sref',
        icon: 'bonuses-history',
        class: 'bonuses-history',
        wlcElement: 'link_bonuses-history',
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
        icon: 'bonuses-voucher',
        class: 'bonuses-voucher',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.promo',
                params: {},
            },
        },
    },
    'profile-first-menu:bonuses-voucher': {
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

    'profile-menu:bonuses-system': {
        name: gettext('Bonuses system'),
        type: 'sref',
        icon: 'bonuses-system',
        class: 'bonuses-system',
        params: {
            state: {
                name: 'app.profile.loyalty-bonuses.system',
                params: {},
            },
        },
    },
    'profile-first-menu:bonuses-system': {
        name: gettext('Bonuses system'),
        type: 'sref',
        icon: 'bonuses-system',
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
        icon: 'tournaments',
        class: 'tournaments',
        params: {
            state: {
                parent: 'app.profile.loyalty-tournaments',
                name: 'app.profile.loyalty-tournaments.main',
                params: {},
            },
        },
        wlcElement: 'block_profile-menu-tournaments"',
    },
    'profile-first-menu:tournaments': {
        name: gettext('Tournaments'),
        type: 'title',
        icon: 'tournaments',
        class: 'tournaments',
        params: {
            blockExpand: true,
            state: {
                parent: 'app.profile.loyalty-tournaments',
                name: 'app.profile.loyalty-tournaments.main',
                params: {},
            },
        },
        wlcElement: 'block_profile-menu-tournaments"',
    },

    'profile-menu:tournaments-current': {
        name: gettext('Available tournaments'),
        type: 'sref',
        icon: 'current-tournaments',
        class: 'tournaments-current',
        params: {
            state: {
                name: 'app.profile.loyalty-tournaments.main',
                params: {},
            },
        },
        wlcElement: 'link_current-tournaments',
    },
    'profile-first-menu:tournaments-current': {
        name: gettext('Available tournaments'),
        type: 'sref',
        icon: 'current-tournaments',
        class: 'tournaments-current',
        params: {
            state: {
                parent: ['app.profile.loyalty-tournaments.main', 'app.profile.loyalty-tournaments.detail'],
                name: 'app.profile.loyalty-tournaments.main',
                params: {},
            },
        },
        wlcElement: 'link_current-tournaments',
    },

    'profile-menu:tournaments-active': {
        name: gettext('Active tournaments'),
        type: 'sref',
        icon: 'active-tournaments',
        class: 'tournaments-active',
        params: {
            state: {
                name: 'app.profile.loyalty-tournaments.active',
                params: {},
            },
        },
        wlcElement: 'link_active-tournaments',
    },
    'profile-first-menu:tournaments-active': {
        name: gettext('Active tournaments'),
        type: 'sref',
        icon: 'active-tournaments',
        class: 'tournaments-active',
        params: {
            state: {
                name: 'app.profile.loyalty-tournaments.active',
                params: {},
            },
        },
        wlcElement: 'link_active-tournaments',
    },

    'profile-menu:tournaments-history': {
        name: gettext('Tournaments history'),
        type: 'sref',
        icon: 'tournaments-history',
        class: 'tournaments-history',
        params: {
            state: {
                name: 'app.profile.loyalty-tournaments.history',
                params: {},
            },
        },
        wlcElement: 'link_tournaments-history',
    },
    'profile-first-menu:tournaments-history': {
        name: gettext('Tournaments history'),
        type: 'sref',
        icon: 'tournaments-history',
        class: 'tournaments-history',
        params: {
            state: {
                name: 'app.profile.loyalty-tournaments.history',
                params: {},
            },
        },
        wlcElement: 'link_tournaments-history',
    },

    'profile-menu:market': {
        name: gettext('Market'),
        type: 'title',
        icon: 'market',
        class: 'market',
        wlcElement: 'link_cc-profile-menu_market',
        params: {
            state: {
                name: 'app.profile.loyalty-store.main',
                params: {},
            },
        },
    },

    'profile-menu:market-with-categories': {
        name: gettext('Market'),
        type: 'market',
        icon: 'market',
        class: 'market',
        wlcElement: 'link_cc-profile-menu_market',
        params: {
            state: {
                name: 'app.profile.loyalty-store.main',
                params: {},
            },
        },
    },

    'profile-first-menu:market': {
        name: gettext('Market'),
        type: 'title',
        icon: 'market',
        class: 'market',
        wlcElement: 'link_cc-profile-menu_market',
        params: {
            blockExpand: true,
            state: {
                parent: ['app.profile.loyalty-store', 'app.profile.loyalty-level-2'],
                name: 'app.profile.loyalty-store.main',
                params: {},
            },
        },
    },

    'profile-menu:store': {
        name: gettext('Store'),
        type: 'sref',
        icon: 'store',
        class: 'store',
        wlcElement: 'link_cc-profile-menu_market',
        params: {
            state: {
                name: 'app.profile.loyalty-store.main',
                params: {},
            },
        },
    },
    'profile-first-menu:store': {
        name: gettext('Store'),
        type: 'sref',
        icon: 'store',
        class: 'store',
        wlcElement: 'link_cc-profile-menu_market',
        params: {
            state: {
                name: 'app.profile.loyalty-store.main',
                params: {},
            },
        },
    },

    'profile-menu:history': {
        name: gettext('History'),
        type: 'title',
        icon: 'history',
        class: 'history',
        wlcElement: 'link_cc-profile-menu_history',
        params: {
            state: {
                parent: [
                    'app.profile.loyalty-bonuses.history',
                    'app.profile.gamblings',
                    'app.profile.cash.transactions',
                    'app.profile.loyalty-tournaments.history',
                ],
                name: 'app.profile.loyalty-bonuses.history',
                params: {},
            },
        },
    },
    'profile-first-menu:history': {
        name: gettext('History'),
        type: 'title',
        icon: 'history',
        class: 'history',
        wlcElement: 'link_cc-profile-menu_history',
        params: {
            state: {
                parent: [
                    'app.profile.loyalty-bonuses.history',
                    'app.profile.gamblings',
                    'app.profile.cash.transactions',
                    'app.profile.loyalty-tournaments.history',
                ],
                name: 'app.profile.loyalty-bonuses.history',
                params: {},
            },
        },
    },

    'profile-menu:store-main': {
        name: gettext('Store'),
        type: 'sref',
        icon: 'store',
        class: 'store-main',
        wlcElement: 'link_cc-profile-menu_market',
        params: {
            state: {
                name: 'app.profile.loyalty-store.main',
                params: {},
            },
        },
    },
    'profile-first-menu:store-main': {
        name: gettext('Store'),
        type: 'sref',
        icon: 'store',
        class: 'store-main',
        wlcElement: 'link_cc-profile-menu_market',
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
        icon: 'store-orders',
        class: 'store-orders',
        params: {
            state: {
                name: 'app.profile.loyalty-store.orders',
                params: {},
            },
        },
    },
    'profile-first-menu:store-orders': {
        name: gettext('Store orders'),
        type: 'sref',
        icon: 'store-orders',
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
        icon: 'cash',
        class: 'cash',
        params: {
            state: {
                parent: 'app.profile.cash',
                name: 'app.profile.cash.deposit',
                params: {},
            },
        },
    },
    'profile-first-menu:cash': {
        name: gettext('Cash'),
        type: 'title',
        icon: 'cash',
        class: 'cash',
        params: {
            blockExpand: true,
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
        class: 'deposit',
        wlcElement: 'link_deposit',
        params: {
            state: {
                name: 'app.profile.cash.deposit',
                params: {},
            },
        },
    },
    'profile-first-menu:cash-deposit': {
        name: gettext('Deposit'),
        type: 'sref',
        class: 'deposit',
        wlcElement: 'link_deposit',
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
        class: 'withdrawal',
        wlcElement: 'link_withdrawal',
        params: {
            state: {
                name: 'app.profile.cash.withdraw',
                params: {},
            },
        },
    },
    'profile-first-menu:cash-withdrawal': {
        name: gettext('Withdrawal'),
        type: 'sref',
        class: 'withdrawal',
        wlcElement: 'link_withdrawal',
        params: {
            state: {
                name: 'app.profile.cash.withdraw',
                params: {},
            },
        },
    },

    'profile-menu:transaction-history': {
        name: gettext('Transactions history'),
        type: 'sref',
        icon: 'transaction-history',
        class: 'transaction-history',
        wlcElement: 'link_transaction-history',
        params: {
            state: {
                name: 'app.profile.cash.transactions',
                params: {},
            },
        },
    },
    'profile-first-menu:transaction-history': {
        name: gettext('Transactions history'),
        type: 'sref',
        icon: 'transaction-history',
        class: 'transaction-history',
        wlcElement: 'link_transaction-history',
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
        icon: 'gamblings',
        class: 'gamblings',
        params: {
            state: {
                parent: 'app.profile.gamblings',
                name: 'app.profile.gamblings.bets',
                params: {},
            },
        },
    },
    'profile-first-menu:gamblings': {
        name: gettext('Gamblings'),
        type: 'title',
        icon: 'gamblings',
        class: 'gamblings',
        params: {
            blockExpand: true,
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
        icon: 'bets-history',
        class: 'bonus-history',
        wlcElement: 'link_bets-history',
        params: {
            state: {
                name: 'app.profile.gamblings.bets',
                params: {},
            },
        },
    },
    'profile-first-menu:bets-history': {
        name: gettext('Bets history'),
        type: 'sref',
        icon: 'bets-history',
        class: 'bonus-history',
        wlcElement: 'link_bets-history',
        params: {
            state: {
                name: 'app.profile.gamblings.bets',
                params: {},
            },
        },
    },

    'profile-menu:messages': {
        name: gettext('Messages'),
        counterParams: {
            type: 'internal-mails',
            theme: 'circle',
            themeMod: 'internal-mails',
            hideIfZero: true,
        },
        type: 'sref',
        icon: 'messages',
        class: 'messages',
        params: {
            state: {
                name: 'app.profile.messages',
                params: {},
            },
        },
    },
    'profile-first-menu:messages': {
        name: gettext('Messages'),
        counterParams: {
            type: 'internal-mails',
            theme: 'circle',
            themeMod: 'internal-mails',
            hideIfZero: true,
        },
        type: 'sref',
        icon: 'messages',
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
        icon: 'logout',
        class: 'logout',
        params: {
            modal: {
                name: 'logout',
            },
        },
    },
    'profile-first-menu:logout': {
        name: gettext('Logout'),
        type: 'modal',
        icon: 'logout',
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
        icon: 'verification',
        class: 'verification',
        wlcElement: 'link_verification',
        params: {
            state: {
                name: 'app.profile.verification',
                params: {},
            },
        },
    },
    'profile-first-menu:verification': {
        name: gettext('Verification'),
        type: 'sref',
        icon: 'verification',
        class: 'verification',
        wlcElement: 'link_verification',
        params: {
            state: {
                name: 'app.profile.verification',
                params: {},
            },
        },
    },

    'profile-menu:kycaml': {
        name: gettext('KYC'),
        type: 'sref',
        icon: 'kycaml',
        class: 'kycaml',
        wlcElement: 'link_kycaml',
        params: {
            state: {
                name: 'app.profile.kycaml',
                params: {},
            },
        },
    },
    'profile-first-menu:kycaml': {
        name: gettext('KYC'),
        type: 'sref',
        icon: 'kycaml',
        class: 'kycaml',
        wlcElement: 'link_kycaml',
        params: {
            state: {
                name: 'app.profile.kycaml',
                params: {},
            },
        },
    },

    'profile-menu:limitations': {
        name: gettext('Responsible gaming'),
        type: 'sref',
        icon: 'limitations',
        class: 'limitations',
        params: {
            state: {
                name: 'app.profile.limitations',
                params: {},
            },
        },
    },
    'profile-first-menu:limitations': {
        name: gettext('Responsible gaming'),
        type: 'sref',
        icon: 'limitations',
        class: 'limitations',
        params: {
            state: {
                name: 'app.profile.limitations',
                params: {},
            },
        },
    },

    'profile-menu:password': {
        name: gettext('Password'),
        type: 'sref',
        icon: 'password',
        class: 'password',
        params: {
            state: {
                name: 'app.profile.password',
                params: {},
            },
        },
    },
    'profile-first-menu:password': {
        name: gettext('Password'),
        type: 'sref',
        icon: 'password',
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
        icon: 'notifications',
        class: 'notifications',
        wlcElement: 'link_cc-profile-menu_notifications',
        params: {
            state: {
                name: 'app.profile.notifications',
                params: {},
            },
        },
    },
    'profile-first-menu:notifications': {
        name: gettext('Notifications'),
        type: 'sref',
        icon: 'notifications',
        class: 'notifications',
        wlcElement: 'link_cc-profile-menu_notifications',
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
        icon: 'payments',
        class: 'payments',
        params: {
            state: {
                name: 'app.profile.payments',
                params: {},
            },
        },
    },
    'profile-first-menu:payments': {
        name: gettext('Payments'),
        type: 'sref',
        icon: 'payments',
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
        icon: 'limits',
        class: 'limits',
        wlcElement: 'link_cc-profile-menu_limits',
        params: {
            state: {
                name: 'app.profile.limits',
                params: {},
            },
        },
    },
    'profile-first-menu:limits': {
        name: gettext('Limits'),
        type: 'sref',
        icon: 'limits',
        class: 'limits',
        wlcElement: 'link_cc-profile-menu_limits',
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
        icon: 'open-bets',
        class: 'active-bonus',
        params: {
            state: {
                name: 'app.sportsbook',
                params: {
                    action: 'show-open-bets',
                },
            },
        },
    },
    'profile-first-menu:open-bets': {
        name: gettext('Open bets'),
        type: 'sref',
        icon: 'open-bets',
        class: 'active-bonus',
        params: {
            state: {
                name: 'app.sportsbook',
                params: {
                    action: 'show-open-bets',
                },
            },
        },
    },

    'profile-menu:loyalty-section': {
        name: gettext('Loyalty'),
        type: 'title',
        icon: 'loyalty',
        class: 'loyalty',
        wlcElement: 'link_loyalty',
        params: {
            state: {
                parent: [
                    'app.profile.loyalty-level',
                ],
                name: 'app.profile.loyalty-level',
                params: {},
            },
        },
    },

    'profile-menu:loyalty': profileLoyaltyMenuItem,

    'profile-menu:loyalty-level-single': {
        ...profileLoyaltyMenuItem,
        name: gettext('Levels'),
    },

    'profile-menu:loyalty-level': profileLoyaltyMenuItem,

    'profile-first-menu:loyalty-level': profileLoyaltyMenuItem,

    'profile-menu:dashboard': {
        name: gettext('Dashboard'),
        type: 'sref',
        icon: 'dashboard',
        class: 'dashboard',
        wlcElement: 'link_cc-profile-menu_dashboard',
        params: {
            state: {
                name: 'app.profile.dashboard',
                params: {},
            },
        },
    },
    'profile-first-menu:dashboard': {
        name: gettext('Dashboard'),
        type: 'sref',
        icon: 'dashboard',
        class: 'dashboard',
        wlcElement: 'link_cc-profile-menu_dashboard',
        params: {
            state: {
                name: 'app.profile.dashboard',
                params: {},
            },
        },
    },
};

export const profileMenuFilter: ProfileMenuParams.IProfileMenuFilter[] = [
    {
        config: '$base.profile.messages.use',
        item: 'profile-menu:messages',
    },
    {
        config: '$base.profile.messages.use',
        item: 'profile-first-menu:messages',
    },
    {
        config: '$base.profile.verification.use',
        item: 'profile-menu:verification',
    },
    {
        config: '$base.profile.verification.use',
        item: 'profile-first-menu:verification',
    },
    {
        config: '$base.profile.verification.useShuftiProKycaml',
        item: 'profile-menu:kycaml',
    },
    {
        config: '$base.profile.verification.useShuftiProKycaml',
        item: 'profile-first-menu:kycaml',
    },
    {
        config: '$base.profile.limitations.use',
        item: 'profile-menu:limitations',
    },
    {
        config: '$base.profile.limitations.use',
        item: 'profile-first-menu:limitations',
    },
    {
        config: '$base.tournaments.use',
        item: 'profile-menu:tournaments',
    },
    {
        config: '$base.tournaments.use',
        item: 'profile-first-menu:tournaments',
    },
    {
        config: '$base.tournaments.use',
        item: 'profile-menu:tournaments-history',
    },
    {
        config: '$base.tournaments.use',
        item: 'profile-first-menu:tournaments-history',
    },
    {
        config: '$base.profile.bonuses.system.use',
        item: 'profile-menu:bonuses-system',
    },
    {
        config: '$base.profile.bonuses.system.use',
        item: 'profile-first-menu:bonuses-system',
    },
    {
        config: '$base.profile.bonuses.inventory.use',
        item: 'profile-menu:bonuses-inventory',
    },
    {
        config: '$base.profile.bonuses.inventory.use',
        item: 'profile-first-menu:bonuses-inventory',
    },
    {
        config: '$base.profile.store.use',
        item: 'profile-menu:market',
    },
    {
        config: '$base.profile.store.singleLevels',
        item: 'profile-menu:loyalty',
    },
    {
        config: '$base.profile.store.use',
        item: 'profile-first-menu:market',
    },
    {
        config: '$base.profile.store.singleLevels',
        item: 'profile-first-menu:loyalty',
    },
    {
        config: '$base.profile.dashboard.use',
        item: 'profile-menu:dashboard',
    },
    {
        config: '$base.profile.dashboard.use',
        item: 'profile-first-menu:dashboard',
    },
    {
        config: '$base.profile.socials.usePage',
        item: 'profile-menu:socials',
    },
    {
        config: '$base.profile.socials.usePage',
        item: 'profile-first-menu:socials',
    },
];
