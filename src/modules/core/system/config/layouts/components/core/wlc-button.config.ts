import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcButton {
    export const searchMerchants: ILayoutComponent = {
        name: 'core.wlc-button',
        display: {
            after: 900,
        },
        params: {
            class: 'wlc-btn wlc-btn-merch',
            common: {
                icon: 'filter-merchants',
                text: 'All providers',
                event: {
                    name: 'SHOW_MODAL',
                    data: 'search',
                },
            },
        },
    };

    export const search: ILayoutComponent = {
        name: 'core.wlc-button',
        params: {
            class: 'wlc-btn wlc-btn-search',
            common: {
                icon: 'search',
                text: 'Search for games',
                event: {
                    name: 'SHOW_MODAL',
                    data: 'search',
                },
            },
        },
    };

    export const searchV2: ILayoutComponent = {
        name: 'core.wlc-button',
        display: {
            after: 1023,
        },
        params: {
            class: 'wlc-btn wlc-btn-search',
            wlcElement: 'wlc-btn-search',
            common: {
                icon: 'search',
                event: {
                    name: 'SHOW_MODAL',
                    data: 'search',
                },
            },
        },
    };

    export const burger: ILayoutComponent = {
        name: 'core.wlc-button',
        params: {
            class: 'wlc-btn wlc-btn-burger',
            wlcElement: 'wlc-btn-burger',
            common: {
                icon: 'burger',
                event: {
                    name: 'PANEL_OPEN',
                    data: 'left',
                },
            },
        },
    };

    export const userIcon: ILayoutComponent = {
        name: 'core.wlc-button',
        display: {
            auth: true,
            before: 1023,
        },
        params: {
            class: 'wlc-btn wlc-btn-user',
            common: {
                icon: 'user-icon',
                sref: 'app.profile.cash.deposit',
                event: {
                    name: 'PANEL_OPEN',
                    data: 'right',
                },
            },
        },
    };

    export const login: ILayoutComponent = {
        name: 'core.wlc-button',
        display: {
            before: 1023,
            auth: false,
        },
        params: {
            class: 'wlc-btn wlc-btn-login',
            common: {
                icon: 'login',
                event: {
                    name: 'SHOW_MODAL',
                    data: 'login',
                },
            },
        },
    };
}
