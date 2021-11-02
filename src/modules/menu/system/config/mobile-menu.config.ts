import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import {commonMenuItems} from 'wlc-engine/modules/menu/system/config/common.items.config';

export const wlcMobileMenuItemsGlobal: MenuParams.IMenuItemsGlobal = {
    'mobile-menu:sportsbook': commonMenuItems.sportsbook,
    'mobile-menu:sportsbook-inplay': {
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
    'mobile-menu:promotions': commonMenuItems.promotions,
    'mobile-menu:tournaments': commonMenuItems.tournaments,
    'mobile-menu:info': {
        name: gettext('Info'),
        type: 'wordpress',
        params: {
            wp: {
                slug: ['legal', 'about-us'],
                defaultState: 'app.contacts',
                defaultType: 'sref',
            },
        },
        icon: 'info',
        class: 'info',
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
    'mobile-menu:lobby': commonMenuItems.lobby,
    'mobile-menu:favourites': commonMenuItems.favourites,
    'mobile-menu:lastplayed': commonMenuItems.lastplayed,
};

export const wlcMobileMenuItemGroupsGlobal: MenuParams.IMenuItemGroupsGlobal = {
    'mobile-menu:info': {
        type: 'group',
        parent: 'mobile-menu:info',
        items: [],
    },
};
