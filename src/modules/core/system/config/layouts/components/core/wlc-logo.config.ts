import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcLogo {

    export const header: ILayoutComponent = {
        name: 'core.wlc-logo',
    };

    export const footerFirst: ILayoutComponent = {
        name: 'core.wlc-logo',
        params: {
            themeMod: 'footer-first',
        },
        display: {
            after: 768,
        },
    };
}
