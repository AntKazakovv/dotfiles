import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcIconList {
    export const merchants: ILayoutComponent = {
        name: 'core.wlc-icon-list',
        params: {
            theme: 'merchants',
            type: 'svg',
            wlcElement: 'block_merchants',
        },
    };

    export const payments: ILayoutComponent = {
        name: 'core.wlc-icon-list',
        params: {
            theme: 'payments',
            type: 'svg',
            wlcElement: 'block_payments',
        },
    };

}
