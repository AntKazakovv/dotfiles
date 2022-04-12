import {ILayoutComponent} from 'wlc-engine/modules/core';
import {ITopRatedCParams} from 'wlc-engine/modules/promo/components/top-rated/top-rated.params';

export namespace wlcTopRated {
    export const def: ILayoutComponent = {
        name: 'promo.wlc-top-rated',
        params: <ITopRatedCParams>{
            rating: {
                mock: {
                    use: true,
                    from: 3.7,
                    to: 4.8,
                },
            },
        },
    };
}
