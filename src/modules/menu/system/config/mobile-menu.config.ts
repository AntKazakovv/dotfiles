import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export const wlcMobileMenuItemsGlobal: MenuParams.IMenuItemsGlobal = {
    'mobile-menu:sportsbook': {
        name: gettext('Sportsbook'),
        type: 'sref',
        icon: 'sportsbook',
        class: 'sportsbook',
        params: {
            state: {
                name: 'app.sportsbook',
                params: {
                    'page': '.',
                },
            },
        },
    },
    'mobile-menu:sportsbook-inplay': {
        name: gettext('In play'),
        type: 'sref',
        class: 'sportsbook-inplay',
        icon: 'sportsbook-inplay',
        params: {
            state: {
                name: 'app.sportsbook',
                params: {
                    page: 'inplay.',
                },
            },
        },
        wlcElement: 'link_main-nav-sports-inplay',
    },
    'mobile-menu:promotions': {
        name: gettext('Promotions'),
        type: 'sref',
        icon: 'promotions',
        class: 'promotions',
        params: {
            state: {
                name: 'app.promotions',
                params: {},
            },
        },
    },
    'mobile-menu:tournaments': {
        name: gettext('Tournaments'),
        type: 'sref',
        class: 'tournaments',
        icon: 'tournaments',
        params: {
            state: {
                name: 'app.tournaments',
            },
        },
    },
    'mobile-menu:info': {
        name: gettext('Info'),
        type: 'sref',
        icon: 'info',
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
        icon: 'privacy-policy',
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
        icon: 'responsible-game',
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
        icon: 'fair-play',
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
        icon: 'games-rules',
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
        icon: 'terms-and-conditions',
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
    'mobile-menu:contact-us': {
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
};
