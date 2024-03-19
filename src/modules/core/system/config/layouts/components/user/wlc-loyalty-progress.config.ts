import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcLoyaltyProgress {
    export const def: ILayoutComponent = {
        name: 'user.wlc-loyalty-progress',
    };

    export const withIcon: ILayoutComponent = {
        name: 'user.wlc-loyalty-progress',
        params: {
            common: {
                showLevelIcon: true,
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
