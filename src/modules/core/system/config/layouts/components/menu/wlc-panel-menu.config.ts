import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces';

export namespace wlcPanelMenu {

    export const fixedBurgerThemeWolf: ILayoutComponent = {
        name: 'menu.wlc-panel-menu',
        params: {
            theme: 'wolf',
            wlcElement: 'block_main-nav-panel',
            icons: {
                folder: 'wlc/icons/european/v3',
                use: true,
            },
        },
    };

    export const fixedBurgerInfoThemeWolf: ILayoutComponent = {
        name: 'menu.wlc-panel-menu',
        params: {
            type: 'info',
            theme: 'wolf',
            wlcElement: 'block_info-nav-panel',
            icons: {
                folder: 'wlc/icons/european/v3',
                use: true,
            },
        },
    };
}
