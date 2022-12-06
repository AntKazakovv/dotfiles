import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcSearch {

    export const def: ILayoutComponent = {
        name: 'games.wlc-search',
        params: {
            theme: 'mobile-app',
            common: {
                gamesGridParams: {
                    themeMod: 'mobile-app-search',
                    thumbParams: {
                        theme: 'default',
                    },
                    moreBtn: {
                        hide: false,
                        lazy: true,
                    },
                    breakpoints: {
                        0: {
                            gamesRows: 5,
                        },
                    },
                },
            },
            searchInputParams: {
                themeMod: 'mobile-app',
            },
        },
    };
}
