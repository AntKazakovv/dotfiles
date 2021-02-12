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
                name: 'app.promotions',
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
    'mobile-menu:privacy-policy': {
        name: gettext('Privacy policy'),
        type: 'sref',
        icon: 'icons/privacy-policy',
        class: 'info',
        params: {
            state: {
                name: 'app.contacts',
                params: {
                    slug: 'privacy-policy',
                },
            },
        },
    },
    'mobile-menu:responsible-game': {
        name: gettext('Responsible game'),
        type: 'sref',
        icon: 'icons/responsible-game',
        class: 'info',
        params: {
            state: {
                name: 'app.contacts',
                params: {
                    slug: 'responsible-game',
                },
            },
        },
    },
    'mobile-menu:fair-play': {
        name: gettext('Fair play'),
        type: 'sref',
        icon: 'icons/fair-play',
        class: 'info',
        params: {
            state: {
                name: 'app.contacts',
                params: {
                    slug: 'fair-play',
                },
            },
        },
    },
    'mobile-menu:games-rules': {
        name: gettext('Games rules'),
        type: 'sref',
        icon: 'icons/games-rules',
        class: 'info',
        params: {
            state: {
                name: 'app.contacts',
                params: {
                    slug: 'games-rules',
                },
            },
        },
    },
    'mobile-menu:terms-and-conditions': {
        name: gettext('Terms and conditions'),
        type: 'sref',
        icon: 'icons/terms-and-conditions',
        class: 'info',
        params: {
            state: {
                name: 'app.contacts',
                params: {
                    slug: 'terms-and-conditions',
                },
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
            'mobile-menu:privacy-policy',
            'mobile-menu:responsible-game',
            'mobile-menu:fair-play',
            'mobile-menu:games-rules',
            'mobile-menu:terms-and-conditions',
        ],
    },
];
