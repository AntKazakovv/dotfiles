import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcProfileMenu {
    export const def: ILayoutComponent = {
        name: 'menu.wlc-profile-menu',
        params: {
        },
    };

    export const defTypeFirst: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'profile-menu-wrapper',
            components: [
                {
                    name: 'menu.wlc-profile-menu',
                    display: {
                        after: 1200,
                    },
                    params: {
                        theme: 'first',
                        type: 'full',
                    },
                },
            ],
        },
    };

    export const submenu: ILayoutComponent = {
        name: 'menu.wlc-profile-menu',
        params: {
            type: 'submenu',
        },
    };

    export const subMenuV1: ILayoutComponent = {
        name: 'menu.wlc-profile-menu',
        params: {
            type: 'submenu',
        },
        display: {
            before: 1199,
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

    export const submenuHistoryV1: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        display: {
            before: 1023,
        },
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
                    name: 'core.wlc-history-range',
                    params: {
                        type: 'submenu',
                        historyType: 'bet',
                    },
                },
            ],
        },
    };

    export const submenuTransactionsHistory: ILayoutComponent = {
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
                    name: 'core.wlc-history-range',
                    params: {
                        type: 'submenu',
                        historyType: 'transaction',
                    },
                },
            ],
        },
    };

    export const submenuProfileMessages: ILayoutComponent = {
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
                    name: 'core.wlc-history-range',
                    params: {
                        type: 'submenu',
                        historyType: 'mails',
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
        display: {
            auth: true,
        },
    };
}
