import {IBonusesListCParams} from 'wlc-engine/modules/bonuses';
import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcPromotionsBonusesList {
    export const def: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: <IBonusesListCParams>{
            theme: 'promo',
            common: {
                filter: 'all',
                filterByGroup: 'Promo',
                sortOrder: ['active', 'promocode', 'subscribe', 'inventory'],
            },
            useRedirectBtnToProfile: true,
            useBtnNoBonuses: true,
        },
    };
    export const withImage: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: <IBonusesListCParams>{
            theme: 'promo',
            themeMod: 'with-image',
            common: {
                filter: 'all',
                filterByGroup: 'Promo',
                sortOrder: ['active', 'promocode', 'subscribe', 'inventory'],
            },
            useRedirectBtnToProfile: true,
            useBtnNoBonuses: true,
        },
        display: {
            before: 559,
        },
    };
}
