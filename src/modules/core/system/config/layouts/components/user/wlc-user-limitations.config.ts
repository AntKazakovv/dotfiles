import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcLimitations {
    export const def: ILayoutComponent = {
        name: 'limitations.wlc-limitations',
    };

    export const wolf: ILayoutComponent = {
        name: 'limitations.wlc-limitations',
        params: {
            infoIcon: '/wlc/icons/status/alert.svg',
            theme: 'wolf',
        },
    };
}
