import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcUserIcon {
    export const userIconKiosk: ILayoutComponent = {
        name: 'user.wlc-user-icon',
        display: {
            auth: true,
            before: 1199,
        },
        params: {
            event: {
                name: 'PANEL_OPEN',
                data: 'right',
            },
            showAsBtn: true,
        },
    };

    export const userIconMobile: ILayoutComponent = {
        name: 'user.wlc-user-icon',
        display: {
            auth: true,
            before: 1199,
        },
        params: {
            event: {
                name: 'PANEL_OPEN',
                data: 'right',
            },
            showAsBtn: true,
        },
    };
}
