import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcGamesCatalog {

    export const def: ILayoutComponent = {
        name: 'games.wlc-games-catalog',
        params: {
            gamesGridParams: {
                themeMod: 'mobile-app',
                gamesRows: 6,
                showTitle: false,
                showAllLink: {
                    use: false,
                },
                moreBtn: {
                    hide: false,
                    lazy: true,
                },
            },
        },
    };
}
