import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcRecaptchaPolicy {
    export const def: ILayoutComponent = {
        name: 'recaptcha.wlc-recaptcha-policy',
        display: {
            configProperty: 'appConfig.useRecaptcha',
        },
    };
}
