import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcUserName {
    export const def: ILayoutComponent = {
        name: 'user.wlc-user-name',
    };

    export const wolf: ILayoutComponent = {
        name: 'user.wlc-user-name',
        params: {
            theme: 'wolf',
            showUserId: true,
        },
    };
}
