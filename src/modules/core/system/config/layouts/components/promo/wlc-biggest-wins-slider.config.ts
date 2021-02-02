import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcBiggestWinsSlider {
    export const def: ILayoutComponent = {
        name: 'promo.wlc-winners-slider',
        params: {
            type: 'biggest',
            theme: 'vertical',
            title: 'Biggest wins',
            wlcElement: 'section_biggest-wins'
        },
    };
}
