import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcMainMenu {
    export const header: ILayoutComponent = {
        name: 'menu.wlc-main-menu',
        display: {
            after: 1023,
        },
        params: {
            themeMod: 'underline',
            type: 'main-menu',
            wlcElement: 'block_main-nav',
        },
    };
}
