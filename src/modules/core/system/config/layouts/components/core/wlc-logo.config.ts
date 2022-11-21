import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcLogo {

    export const header: ILayoutComponent = {
        name: 'core.wlc-logo',
    };

    export const headerTabletOnly: ILayoutComponent = {
        name: 'core.wlc-logo',
        display: {
            after: 768,
        },
    };

    export const headerDesktopOnly: ILayoutComponent = {
        name: 'core.wlc-logo',
        display: {
            after: 1200,
        },
    };

    export const headerLogoSmall: ILayoutComponent = {
        name: 'core.wlc-logo',
        display: {
            before: 1199,
        },
        params: {
            image: {
                url: 'logo-small.svg',
            },
        },
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
