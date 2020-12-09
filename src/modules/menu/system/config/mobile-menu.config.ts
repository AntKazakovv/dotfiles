import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export const wlcMobileMenuItemsGlobal: MenuParams.IMenuItemsGlobal = {
    'mobile-menu:sportsbook': {
        name: gettext('Sportsbook'),
        type: 'sref',
        icon: 'icons/sportsbook',
        class: 'sportsbook',
        params: {
            state: {
                name: 'app.sportsbook',
                params: {},
            },
        },
    },
    'mobile-menu:promotions': {
        name: gettext('Promotions'),
        type: 'sref',
        icon: 'icons/promotions',
        class: 'promotions',
        params: {
            state: {
                name: 'app.profile.main.info',
                params: {},
            },
        },
    },
    'mobile-menu:info': {
        name: gettext('Info'),
        type: 'sref',
        icon: 'icons/info',
        class: 'info',
        params: {
            state: {
                name: 'app.promotions',
                params: {},
            },
        },
    },
    'mobile-menu:info2': {
        name: gettext('Info'),
        type: 'sref',
        icon: 'icons/info',
        class: 'info',
        params: {
            state: {
                name: 'app.promotions',
                params: {},
            },
        },
    },
    'mobile-menu:info3': {
        name: gettext('Info'),
        type: 'sref',
        icon: 'icons/info',
        class: 'info',
        params: {
            state: {
                name: 'app.promotions',
                params: {},
            },
        },
    },
};

export const wlcMobileMenuItemsDefault: MenuParams.MenuConfigItem[] = [
    'mobile-menu:sportsbook',
    'mobile-menu:promotions',
    {
        parent: 'mobile-menu:info',
        items: [
            'mobile-menu:info2',
            'mobile-menu:info3',
        ],
    },
];
