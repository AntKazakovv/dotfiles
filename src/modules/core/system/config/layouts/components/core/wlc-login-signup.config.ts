import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcLoginSignup {
    export const header: ILayoutComponent = {
        name: 'core.wlc-login-signup',
        display: {
            after: 1200,
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
    export const burgerPanel: ILayoutComponent = {
        name: 'core.wlc-login-signup',
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
