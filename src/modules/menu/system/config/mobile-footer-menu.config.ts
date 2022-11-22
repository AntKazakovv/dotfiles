import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export const wlcMobileFooterMenuItemsGlobal: MenuParams.IMenuItemsGlobal = {
    'mobile-footer-menu:home': {
        name: gettext('Home'),
        type: 'sref',
        class: 'lobby',
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
    },
    'mobile-footer-menu:games': {
        name: gettext('Games'),
        type: 'sref',
        class: 'games',
        icon: 'games',
        params: {
            state: {
                name: 'app.providers',
                params: {
                    provider: '',
                },
            },
            href: {
                url: '/providers',
                baseSiteUrl: true,
            },
        },
        wlcElement: 'link_main-nav-casino',
    },
    'mobile-footer-menu:search': {
        name: gettext('Search'),
        type: 'sref',
        class: 'search',
        icon: 'search',
        params: {
            state: {
                name: 'app.games-search',
            },
            href: {
                url: '/search',
                baseSiteUrl: true,
            },
        },
    },
    'mobile-footer-menu:menu': {
        name: gettext('Menu'),
        type: 'sref',
        class: 'menu',
        icon: 'menu',
        params: {
            state: {
                name: 'app.menu',
            },
            href: {
                url: '/menu',
                baseSiteUrl: true,
            },
        },
    },
};
