import {ILayoutComponent} from 'wlc-engine/modules/core';
import {ILoyaltyBlockCParams} from 'wlc-engine/modules/user';

export namespace wlcDashboardLoyaltyBlock {
    export const def: ILayoutComponent = {
        name: 'user.wlc-loyalty-block',
    };

    export const wolf: ILayoutComponent = {
        name: 'user.wlc-loyalty-block',
        params: <ILoyaltyBlockCParams>{
            theme: 'wolf',
        },
    };
}
