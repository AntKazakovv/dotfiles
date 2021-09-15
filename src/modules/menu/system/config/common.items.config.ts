import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export namespace commonMenuItems {

    export const favourites: MenuParams.IMenuItem = {
        name: gettext('Favourites'),
        type: 'sref',
        icon: 'favourites',
        class: 'favourites',
        params: {
            state: {
                name: 'app.catalog',
                params: {
                    category: 'favourites',
                },
            },
            href: {
                url: '/catalog/favourites',
                baseSiteUrl: true,
            },
        },
        auth: true,
    };

    export const lastplayed: MenuParams.IMenuItem = {
        name: gettext('Last played'),
        type: 'sref',
        icon: 'last-played',
        class: 'last-played',
        params: {
            state: {
                name: 'app.catalog',
                params: {
                    category: 'lastplayed',
                },
            },
            href: {
                url: '/catalog/lastplayed',
                baseSiteUrl: true,
            },
        },
        auth: true,
    };

    export const lobby: MenuParams.IMenuItem = {
        name: gettext('Lobby'),
        type: 'sref',
        icon: 'lobby',
        class: 'lobby',
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
    };

    export const promotions: MenuParams.IMenuItem = {
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
    };

    export const sportsbook: MenuParams.IMenuItem = {
        name: gettext('Sportsbook'),
        type: 'sref',
        icon: 'sportsbook',
        class: 'sportsbook',
        params: {
            state: {
                name: 'app.sportsbook',
            },
            href: {
                url: '/sportsbook/',
                baseSiteUrl: true,
            },
        },
    };

    export const tournaments: MenuParams.IMenuItem = {
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
    };

}
