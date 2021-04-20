import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcProfileMenu {
    export const def: ILayoutComponent = {
        name: 'menu.wlc-profile-menu',
        params: {
        },
    };

    export const defTypeFirst: ILayoutComponent = {
        name: 'menu.wlc-profile-menu',
        display: {
            after: 1024,
        },
        params: {
            theme: 'first',
            type: 'full',
        },
    };

    export const submenu: ILayoutComponent = {
        name: 'menu.wlc-profile-menu',
        params: {
            type: 'submenu',
        },
    };

    export const submenuHistory: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-submenu-history',
            components: [
                {
                    name: 'menu.wlc-profile-menu',
                    params: {
                        type: 'submenu',
                    },
                },
            ],
        },
    };

    export const submenuBetHistory: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-submenu-history',
            components: [
                {
                    name: 'menu.wlc-profile-menu',
                    params: {
                        type: 'submenu',
                    },
                },
                {
                    name: 'finances.wlc-history-range',
                    params: {
                        type: 'submenu',
                    },
                },
            ],
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
