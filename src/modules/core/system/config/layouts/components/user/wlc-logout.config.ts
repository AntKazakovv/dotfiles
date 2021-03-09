import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcLogout {
    export const useText: ILayoutComponent = {
        name: 'user.wlc-logout',
        params: {
            useText: true,
        },
        display: {
            before: 900,
        },
    };

    export const def: ILayoutComponent = {
        name: 'user.wlc-logout',
    };
}
