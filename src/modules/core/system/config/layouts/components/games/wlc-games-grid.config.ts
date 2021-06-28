import {ILayoutComponent} from 'wlc-engine/modules/core';
import {IGamesGridCParams} from 'wlc-engine/modules/games';

export namespace wlcGamesGrid {
    export const allGames2rows: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            gamesRows: 2,
            title: gettext('Popular games'),
            usePlaceholders: true,
            filter: {
                categories: ['popular'],
            },
            showAllLink: {
                use: true,
                sref: 'app.catalog',
                params: {
                    category: 'popular',
                },
            },
            moreBtn: {
                hide: true,
                lazy: false,
            },
            breakpoints: {
                'mobile': {
                    gamesRows: 3,
                    moreBtn: {
                        hide: false,
                    },
                },
            },
        },
    };

    export const roullete1row: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            gamesRows: 2,
            title: gettext('New games'),
            filter: {
                categories: ['new'],
            },
            usePlaceholders: true,
            showAllLink: {
                use: true,
                sref: 'app.catalog',
                params: {
                    category: 'new',
                },
            },
            moreBtn: {
                hide: true,
                lazy: false,
            },
            breakpoints: {
                'mobile': {
                    gamesRows: 3,
                    moreBtn: {
                        hide: false,
                    },
                },
            },
        },
    };

    export const allGames3rows: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            gamesRows: 3,
            title: gettext('All games'),
            filter: null,
            showAllLink: {
                use: false,
            },
            moreBtn: {
                hide: false,
                lazy: false,
            },
            usePlaceholders: true,
            byState: true,
        },
    };

    export const catalogGamesWithLoadMoreBtn: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            title: gettext('All games'),
            filter: null,
            showAllLink: {
                use: false,
            },
            moreBtn: {
                hide: false,
                lazy: false,
            },
            byState: true,
            breakpoints: {
                'mobile': {
                    gamesRows: 3,
                },
            },
        },
    };

    export const catalogGamesWithLazyLoad: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            title: gettext('All games'),
            filter: null,
            showAllLink: {
                use: false,
            },
            moreBtn: {
                hide: false,
                lazy: true,
            },
            byState: true,
            breakpoints: {
                'mobile': {
                    gamesRows: 3,
                },
            },
        },
    };

    export const vertical: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            gamesRows: 1,
            title: gettext('Vertical games'),
            usePlaceholders: true,
            filter: {
                categories: ['vertical'],
            },
            thumbParams: {
                theme: 'vertical',
                type: 'vertical',
            },
            showAllLink: {
                use: true,
                sref: 'app.catalog',
                params: {
                    category: 'vertical',
                },
            },
        },
    };
}
