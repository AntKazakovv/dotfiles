import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcLoginSignup {
    export const header: ILayoutComponent = {
        name: 'user.wlc-login-signup',
        display: {
            after: 1023,
            auth: false,
        },
        params: {
            login: {
                action: 'login',
            },
            signup: {
                action: 'signup',
            },
        },
    };
    export const panel: ILayoutComponent = {
        name: 'user.wlc-login-signup',
        display: {
            auth: false,
        },
        params: {
            login: {
                action: 'login',
            },
            signup: {
                action: 'signup',
            },
        },
    };
}
