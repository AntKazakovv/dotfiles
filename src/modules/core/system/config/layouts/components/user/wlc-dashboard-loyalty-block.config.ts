import {ILayoutComponent} from 'wlc-engine/modules/core';
import {ILoyaltyBlockCParams} from 'wlc-engine/modules/user';

export namespace wlcDashboardLoyaltyBlock {
    export const def: ILayoutComponent = {
        name: 'user.wlc-loyalty-block',
    };

    export const defWithExpDate: ILayoutComponent = {
        name: 'user.wlc-loyalty-block',
        params: {
            loyaltyProgressParams: {
                common: {
                    showLevelIcon: false,
                    showExpiryDate: true,
                },
            },
        },
    };

    export const wolf: ILayoutComponent = {
        name: 'user.wlc-loyalty-block',
        params: <ILoyaltyBlockCParams>{
            theme: 'wolf',
        },
    };

    export const wolfWithExpDate: ILayoutComponent = {
        name: 'user.wlc-loyalty-block',
        params: <ILoyaltyBlockCParams>{
            theme: 'wolf',
            loyaltyProgressParams: {
                common: {
                    showLevelIcon: false,
                    showExpiryDate: true,
                },
            },
        },
    };
}
