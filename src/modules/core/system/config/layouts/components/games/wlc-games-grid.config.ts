import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcGamesGrid {
    export const allGames2rows: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: {
            gamesRows: 2,
            title: 'All games',
            usePlaceholders: true,
            showAllLink: {
                use: true,
                link: 'app.catalog',
            },
        },
    };

    export const roullete1row: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: {
            gamesRows: 1,
            title: 'Roullete',
            filter: {
                category: 'roulletegames',
            },
            usePlaceholders: true,
            showAllLink: {
                use: true,
                link: 'app.catalog.popular',
            },
            moreBtn: {
                hide: true,
                lazy: false,
            },
        },
    };

    export const allGames3rows: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: {
            gamesRows: 3,
            title: 'All games',
            filter: undefined,
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
}
