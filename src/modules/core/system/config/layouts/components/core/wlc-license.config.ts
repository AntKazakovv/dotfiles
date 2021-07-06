import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcLicense {
    export const def: ILayoutComponent = {
        name: 'core.wlc-license',
    };

    export const onlyDesktop: ILayoutComponent = {
        name: 'core.wlc-license',
        display: {
            after: 1024,
        },
    };

    export const onlyMobile: ILayoutComponent = {
        name: 'core.wlc-license',
        display: {
            before: 1023,
        },
    };
}
