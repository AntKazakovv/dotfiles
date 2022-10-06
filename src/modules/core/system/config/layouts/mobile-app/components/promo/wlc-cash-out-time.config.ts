import {ILayoutComponent} from 'wlc-engine/modules/core';
import {ICashOutTimeCParams} from 'wlc-engine/modules/promo/components/cash-out-time/cash-out-time.params';

export namespace wlcCashOutTime {
    export const def: ILayoutComponent = {
        name: 'promo.wlc-cash-out-time',
        params: <ICashOutTimeCParams>{},
    };

    export const useSprite: ILayoutComponent = {
        name: 'promo.wlc-cash-out-time',
        params: <ICashOutTimeCParams>{
            useSprite: true,
        },
    };
}

