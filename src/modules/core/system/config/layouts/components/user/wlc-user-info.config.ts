import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcUserInfo {
    export const header: ILayoutComponent = {
        name: 'user.wlc-user-info',
        display: {
            auth: true,
            after: 1023,
        },
    };
}
