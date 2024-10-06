import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcGameWrapper {
    export const def: ILayoutComponent = {
        name: 'games.wlc-game-wrapper',
        reloadOnStateChange: true,
    };

    export const wolf: ILayoutComponent = {
        name: 'games.wlc-game-wrapper',
        reloadOnStateChange: true,
        params: {
            themeMod: 'wolf',
        },
    };
}
