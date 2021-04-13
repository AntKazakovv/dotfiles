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

    export const one: ILayoutComponent = {
        name: 'promo.wlc-winners-slider',
        display: {
            after: 900,
        },
        params: {
            type: 'latest',
            theme: '1',
            title: gettext('Recent wins'),
            wlcElement: 'section_last-winners',
        },
    };
}
