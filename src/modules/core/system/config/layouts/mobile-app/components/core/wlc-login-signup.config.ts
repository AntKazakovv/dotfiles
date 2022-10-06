import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import {ILoginSignupCParams} from 'wlc-engine/modules/core/components/login-signup/login-signup.params';

export namespace wlcLoginSignup {
    export const header: ILayoutComponent = {
        name: 'core.wlc-login-signup',
        display: {
            after: 1200,
            auth: false,
        },
        params: <ILoginSignupCParams> {
            login: {
                action: 'login',
            },
            signup: {
                action: 'signup',
            },
        },
    };
    export const headerAnimateSignUp: ILayoutComponent = {
        name: 'core.wlc-login-signup',
        display: {
            after: 1200,
            auth: false,
        },
        params: <ILoginSignupCParams> {
            login: {
                action: 'login',
            },
            signup: {
                action: 'signup',
                animate: {
                    type: 'pulse',
                    handlerType: 'click',
                },
            },
        },
    };
    export const burgerPanel: ILayoutComponent = {
        name: 'core.wlc-login-signup',
        display: {
            auth: false,
        },
        params: <ILoginSignupCParams> {
            login: {
                action: 'login',
            },
            signup: {
                action: 'signup',
            },
        },
    };
}
