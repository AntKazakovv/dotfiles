import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export const wlcMainMenuItemsGlobal: MenuParams.IMenuItemsGlobal = {
    'main-menu:home': {
        name: gettext('Home page'),
        type: 'sref',
        class: 'home',
        icon: 'lobby',
        sort: 100,
        params: {
            state: {
                name: 'app.home',
                params: {},
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
                params: {category: ''},
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
        },
        wlcElement: 'link_main-nav-table',
    },
    'main-menu:promotions': {
        name: gettext('Promotions'),
        type: 'sref',
        class: 'promo',
        icon: 'promotions',
        params: {
            state: {
                name: 'app.promotions',
                params: {},
            },
        },
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
        },
        wlcElement: 'link_main-nav-lottery',
    },
    'main-menu:tournaments': {
        name: gettext('Tournaments'),
        type: 'sref',
        class: 'tournaments',
        icon: 'tournaments',
        params: {
            state: {
                name: 'app.tournaments',
            },
        },
        wlcElement: 'link_main-nav-tournaments',
    },
    'main-menu:sportsbook': {
        name: gettext('Sportsbook'),
        type: 'sref',
        class: 'sportsbook',
        icon: 'sportsbook',
        params: {
            state: {
                name: 'app.sportsbook',
                params: {
                },
            },
        },
        wlcElement: 'link_main-nav-sports',
    },
};
