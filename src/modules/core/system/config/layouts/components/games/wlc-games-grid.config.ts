import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcGamesGrid {
    export const allGames2rows: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: {
            gamesRows: 2,
            title: 'Popular games',
            usePlaceholders: true,
            filter: {
                category: 'popular',
            },
            showAllLink: {
                use: true,
                link: 'app.catalog',
                params: {
                    category: 'popular',
                },
            },
            moreBtn: {
                hide: true,
                lazy: false,
            },
            mobileSettings: {
                gamesRows: 3,
                showLoadButton: true,
            },
        },
    };

    export const roullete1row: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: {
            gamesRows: 2,
            title: 'New games',
            filter: {
                category: 'new',
            },
            usePlaceholders: true,
            showAllLink: {
                use: true,
                link: 'app.catalog',
                params: {
                    category: 'new',
                },
            },
            moreBtn: {
                hide: true,
                lazy: false,
            },
            mobileSettings: {
                gamesRows: 3,
                showLoadButton: true,
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
            mobileSettings: {
                gamesRows: 3,
                showLoadButton: true,
            },
        },
    };
}
