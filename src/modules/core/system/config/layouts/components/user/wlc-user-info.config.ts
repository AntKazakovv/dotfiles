import {ILayoutComponent} from 'wlc-engine/modules/core';
import {IUserInfoCParams} from 'wlc-engine/modules/user';

export namespace wlcUserInfo {
    export const header: ILayoutComponent = {
        name: 'user.wlc-user-info',
        display: {
            auth: true,
            after: 1200,
        },
    };

    export const headerAnimateDepositBtn: ILayoutComponent = {
        name: 'user.wlc-user-info',
        params: <IUserInfoCParams> {
            button: {
                animate: {
                    type: 'pulse',
                    handlerType: 'deposit',
                },
            },
        },
        display: {
            auth: true,
            after: 1200,
        },
    };

    export const stickyHeader: ILayoutComponent = {
        name: 'user.wlc-user-info',
        params: <IUserInfoCParams> {
            theme: 'sticky',
        },
        display: {
            auth: true,
            after: 1200,
        },
    };

    export const headerWolf: ILayoutComponent = {
        name: 'user.wlc-user-info',
        params: <IUserInfoCParams> {
            userStatsParams: {
                theme: 'wolf',
                type: 'header',
            },
            button: {
                use: false,
            },
        },
        display: {
            auth: true,
            after: 1200,
        },
    };
}
