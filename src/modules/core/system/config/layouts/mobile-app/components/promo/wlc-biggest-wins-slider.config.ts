import {ILayoutComponent} from 'wlc-engine/modules/core';
import {IWinnersSliderCParams} from 'wlc-engine/modules/promo';

export namespace wlcBiggestWinsSlider {
    export const def: ILayoutComponent = {
        name: 'promo.wlc-winners-slider',
        params: <IWinnersSliderCParams>{
            type: 'biggest',
            theme: 'vertical',
            title: 'Biggest wins',
            wlcElement: 'section_biggest-wins',
        },
    };

    export const transparent: ILayoutComponent = {
        name: 'promo.wlc-winners-slider',
        params: <IWinnersSliderCParams>{
            type: 'biggest',
            theme: 'transparent',
            title: 'Biggest wins',
            wlcElement: 'section_biggest-wins',
        },
    };

    export const one: ILayoutComponent = {
        name: 'promo.wlc-winners-slider',
        params: <IWinnersSliderCParams>{
            type: 'biggest',
            theme: '1',
            title: gettext('Biggest wins'),
            wlcElement: 'section_biggest-wins',
            swiper: {
                slidesPerView: 4,
            },
        },
    };
}
