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
            href: {
                url: '/sportsbook/',
                baseSiteUrl: true,
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
            href: {
                url: '/sportsbook/inplay/',
                baseSiteUrl: true,
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
            href: {
                url: '/promotions/',
                baseSiteUrl: true,
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
            href: {
                url: '/tournaments/',
                baseSiteUrl: true,
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
            href: {
                url: '/promotions/',
                baseSiteUrl: true,
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
            href: {
                url: '/contacts/privacy-policy/',
                baseSiteUrl: true,
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
            href: {
                url: '/contacts/responsible-game/',
                baseSiteUrl: true,
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
            href: {
                url: '/contacts/fair-play/',
                baseSiteUrl: true,
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
            href: {
                url: '/contacts/games-rules/',
                baseSiteUrl: true,
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
            href: {
                url: '/contacts/terms-and-conditions/',
                baseSiteUrl: true,
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
            href: {
                url: '/contacts/feedback',
                baseSiteUrl: true,
            },
        },
    },
};
