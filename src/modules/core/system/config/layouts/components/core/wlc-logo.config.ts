import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcLogo {
    export const footer: ILayoutComponent = {
        name: 'core.wlc-logo',
        display: {
            after: 899,
        },
    };

    export const header: ILayoutComponent = {
        name: 'core.wlc-logo',
    };
}
