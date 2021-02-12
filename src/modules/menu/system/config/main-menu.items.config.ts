import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export const wlcMainMenuItemsGlobal: MenuParams.IMenuItemsGlobal = {
    'main-menu:home': {
        name: gettext('Home page'),
        type: 'sref',
        class: 'home',
        params: {
            state: {
                name: 'app.home',
                params: {},
            },
        },
    },
    'main-menu:casino': {
        name: gettext('Casino'),
        type: 'sref',
        class: 'casino',
        params: {
            state: {
                name: 'app.catalog',
                params: {category: ''},
            },
        },
    },
    'main-menu:tablegames': {
        name: gettext('Table games'),
        type: 'sref',
        class: 'table',
        params: {
            state: {
                name: 'app.catalog',
                params: {
                    category: 'table',
                },
            },
        },
    },
    'main-menu:promotions': {
        name: gettext('Promotions'),
        type: 'sref',
        class: 'promo',
        params: {
            state: {
                name: 'app.promotions',
                params: {},
            },
        },
    },
    'main-menu:contacts': {
        name: gettext('Contacts'),
        type: 'sref',
        class: 'contacts',
        params: {
            state: {
                name: 'app.contacts',
                params: {
                    slug: 'feedback',
                },
            },
        },
    },
    'main-menu:lottery': {
        name: gettext('Lottery'),
        type: 'sref',
        class: 'lottery',
        params: {
            state: {
                name: 'app.lottery',
                params: {
                },
            },
        },
    },
    'main-menu:tournaments': {
        name: gettext('Tournaments'),
        type: 'sref',
        class: 'tournaments',
        params: {
            state: {
                name: 'app.tournaments',
                params: {
                },
            },
        },
    },
};
