import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcProfileMenu {
    export const def: ILayoutComponent = {
        name: 'menu.wlc-profile-menu',
        params: {
        },
    };

    export const submenu: ILayoutComponent = {
        name: 'menu.wlc-profile-menu',
        params: {
            type: 'submenu',
        },
    };

    export const vertical: ILayoutComponent = {
        name: 'menu.wlc-profile-menu',
        params: {
            theme: 'dropdown',
            themeMod: 'vertical',
            type: 'dropdown',
            common: {
                useArrow: true,
            },
        },
    };
}
