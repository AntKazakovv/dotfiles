import {ILayoutComponent} from 'wlc-engine/modules/core';
import {ITopRatedCParams} from 'wlc-engine/modules/promo/components/top-rated/top-rated.params';

export namespace wlcTopRated {
    export const def: ILayoutComponent = {
        name: 'promo.wlc-top-rated',
        params: <ITopRatedCParams>{
        },
    };

    export const useSprite: ILayoutComponent = {
        name: 'promo.wlc-top-rated',
        params: <ITopRatedCParams>{
            useSprite: true,
        },
    };

}
