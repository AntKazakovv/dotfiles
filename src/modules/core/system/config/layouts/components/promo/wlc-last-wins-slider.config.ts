import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcLastWinsSlider {
    export const def: ILayoutComponent = {
        name: 'promo.wlc-winners-slider',
        params: {
            type: 'latest',
            theme: 'vertical',
            title: 'Recent wins',
            wlcElement: 'section_last-winners',
        },
    };
}
