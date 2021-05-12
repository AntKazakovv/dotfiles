import {ILayoutComponent} from 'wlc-engine/modules/core';
import {IIconListCParams} from 'wlc-engine/modules/core/components';

export namespace wlcIconList {
    export const merchants: ILayoutComponent = {
        name: 'core.wlc-icon-list',
        params: <IIconListCParams>{
            theme: 'merchants',
            type: 'svg',
            wlcElement: 'block_merchants',
            hideImgOnError: true,
        },
    };

    export const payments: ILayoutComponent = {
        name: 'core.wlc-icon-list',
        params: <IIconListCParams>{
            theme: 'payments',
            watchForScroll: true,
            wlcElement: 'block_payments',
            colorIconBg: 'dark',
            hideImgOnError: true,
        },
    };

}
