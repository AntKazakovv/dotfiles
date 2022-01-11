import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcUserInfo {
    export const header: ILayoutComponent = {
        name: 'user.wlc-user-info',
        display: {
            auth: true,
            after: 1200,
        },
    };

    export const stickyHeader: ILayoutComponent = {
        name: 'user.wlc-user-info',
        params: {
            theme: 'sticky',
        },
        display: {
            auth: true,
            after: 1200,
        },
    };
}
