import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcEnterPromocode {
    export const def: ILayoutComponent = {
        name: 'bonuses.wlc-enter-promocode',
    };

    export const hideTitle: ILayoutComponent = {
        name: 'bonuses.wlc-enter-promocode',
        params: {
            theme: 'clear',
            common: {
                showTitle: false,
            },
        },
    };
};
