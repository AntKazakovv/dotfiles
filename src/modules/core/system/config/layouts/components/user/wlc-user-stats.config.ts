import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcUserStats {
    export const def: ILayoutComponent = {
        name: 'user.wlc-user-stats',
    };

    export const store: ILayoutComponent = {
        name: 'user.wlc-user-stats',
        params: {
            type: 'store',
        },
    };
}
