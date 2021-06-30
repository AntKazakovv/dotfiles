import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcPromotionsBonusesList {
    export const def: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            theme: 'promo',
            common: {
                filter: 'all',
                filterByGroup: 'Promo',
            },
            useRedirectBtnToProfile: true,
        },
    };
}
