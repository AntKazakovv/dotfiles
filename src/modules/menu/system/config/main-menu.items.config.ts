import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import {commonMenuItems} from 'wlc-engine/modules/menu/system/config/common.items.config';

export const wlcMainMenuItemsGlobal: MenuParams.IMenuItemsGlobal = {
    'main-menu:home': {
        name: gettext('Home page'),
        type: 'sref',
        class: 'home',
        icon: 'lobby',
        sort: 0,
        params: {
            state: {
                name: 'app.home',
                params: {},
            },
            href: {
                url: '/',
                baseSiteUrl: true,
            },
        },
        wlcElement: 'link_main-nav-home',
    },
    'main-menu:casino': {
        name: gettext('Casino'),
        type: 'sref',
        class: 'casino',
        icon: 'casino',
        params: {
            state: {
                name: 'app.catalog',
                params: {
                    category: '',
                },
            },
            href: {
                url: '/catalog/casino/',
                baseSiteUrl: true,
            },
        },
        wlcElement: 'link_main-nav-casino',
    },
    'main-menu:tablegames': {
        name: gettext('Table games'),
        type: 'sref',
        class: 'table',
        icon: 'tablegames',
        params: {
            state: {
                name: 'app.catalog',
                params: {
                    category: 'table',
                },
            },
            href: {
                url: '/catalog/tablegames/',
                baseSiteUrl: true,
            },
        },
        wlcElement: 'link_main-nav-table',
    },
    'main-menu:promotions': {
        ...commonMenuItems.promotions,
        wlcElement: 'link_main-nav-promo',
    },
    'main-menu:contacts': {
        name: gettext('Contact Us'),
        type: 'sref',
        class: 'contacts',
        icon: 'info',
        params: {
            state: {
                name: 'app.contacts',
                params: {
                    slug: 'feedback',
                },
            },
            href: {
                url: '/contacts/feedback/',
                baseSiteUrl: true,
            },
        },
        wlcElement: 'link_main-nav-contuctus',
    },
    'main-menu:lottery': {
        name: gettext('Lottery'),
        type: 'sref',
        class: 'lottery',
        icon: 'lottery',
        params: {
            state: {
                name: 'app.lottery',
                params: {
                },
            },
            href: {
                url: '/lottery/',
                baseSiteUrl: true,
            },
        },
        wlcElement: 'link_main-nav-lottery',
    },
    'main-menu:tournaments': {
        ...commonMenuItems.tournaments,
        wlcElement: 'link_main-nav-tournaments',
    },
    'main-menu:sportsbook': {
        ...commonMenuItems.sportsbook,
        wlcElement: 'link_main-nav-sports',
    },
    'main-menu:sportsbook-inplay': {
        name: gettext('In play'),
        type: 'sref',
        class: 'sportsbook-inplay',
        icon: 'sportsbook-inplay',
        params: {
            state: {
                name: 'app.sportsbook',
                params: {
                    page: 'inplay',
                },
            },
            href: {
                url: '/sportsbook/inplay/',
                baseSiteUrl: true,
            },
        },
        wlcElement: 'link_main-nav-sports-inplay',
    },
};
