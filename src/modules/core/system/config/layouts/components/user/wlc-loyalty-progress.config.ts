import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcLoyaltyProgress {
    export const def: ILayoutComponent = {
        name: 'user.wlc-loyalty-progress',
    };

    export const defWithExpDate: ILayoutComponent = {
        name: 'user.wlc-loyalty-progress',
        params: {
            common: {
                showExpiryDate: true,
            },
        },
    };

    export const market: ILayoutComponent = {
        name: 'user.wlc-loyalty-progress',
        display: {
            before: 639,
        },
    };
}
