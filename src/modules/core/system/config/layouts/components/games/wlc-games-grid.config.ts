import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcGamesGrid {
    export const allGames2rows: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: {
            gamesRows: 2,
            title: gettext('Popular games'),
            usePlaceholders: true,
            filter: {
                categories: ['popular'],
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
            title: gettext('New games'),
            filter: {
                categories: ['new'],
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
            mobileSettings: {
                gamesRows: 3,
                showLoadButton: true,
            },
        },
    };

    export const catalogGamesWithLoadMoreBtn: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: {
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
            mobileSettings: {
                gamesRows: 3,
                showLoadButton: true,
            },
        },
    };

    export const catalogGamesWithLazyLoad: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: {
            title: gettext('All games'),
            filter: null,
            showAllLink: {
                use: false,
            },
            moreBtn: {
                hide: false,
                lazy: true,
            },
            usePlaceholders: true,
            byState: true,
            mobileSettings: {
                gamesRows: 3,
                showLoadButton: true,
            },
        },
    };

    export const vertical: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: {
            gamesRows: 1,
            title: gettext('Vertical games'),
            usePlaceholders: true,
            filter: {
                category: 'vertical',
            },
            thumbParams: {
                theme: 'vertical',
                type: 'vertical',
            },
            showAllLink: {
                use: true,
                link: 'app.catalog',
                params: {
                    category: 'vertical',
                },
            },
        },
    };
}
