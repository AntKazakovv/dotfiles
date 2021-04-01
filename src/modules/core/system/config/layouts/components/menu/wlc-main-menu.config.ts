import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcMainMenu {
    export const header: ILayoutComponent = {
        name: 'menu.wlc-main-menu',
        display: {
            after: 1200,
        },
        params: {
            type: 'main-menu',
            wlcElement: 'block_main-nav',
        },
    };

    export const burgerPanel: ILayoutComponent = {
        name: 'menu.wlc-main-menu',
        params: {
            theme: 'burger-panel',
            themeMod: 'underline',
            type: 'main-menu',
            wlcElement: 'block_main-nav-panel',
        },
    };

    export const burgerPanelIcons: ILayoutComponent = {
        name: 'menu.wlc-main-menu',
        params: {
            theme: 'burger-panel',
            themeMod: 'underline',
            type: 'main-menu',
            wlcElement: 'block_main-nav-panel',
            common: {
                icons: {
                    folder: 'wlc/icons/european/v1',
                    use: true,
                },
            },
        },
    };
}
