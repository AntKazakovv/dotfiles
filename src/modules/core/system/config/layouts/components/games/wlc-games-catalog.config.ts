import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcGamesCatalog {

    export const def: ILayoutComponent = {
        name: 'games.wlc-games-catalog',
    };

    export const wolf: ILayoutComponent = {
        name: 'games.wlc-games-catalog',
        params: {
            gamesGridParams: {
                themeMod: 'wolf',
                gamesRows: 4,
            },
        },
    };
}
