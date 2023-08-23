import {ILayoutComponent} from 'wlc-engine/modules/core';
import {IJackpotsSliderCParams} from 'wlc-engine/modules/promo/components/jackpots-slider/jackpots-slider.params';

export namespace wlcJackpotsSlider {

    export const def: ILayoutComponent = {
        name: 'promo.wlc-jackpots-slider',
        params: <IJackpotsSliderCParams>{
            theme: 'vertical',
            wlcElement: 'wlc-jackpots-slider',
            title: 'Jackpots',
        },
    };

    export const one: ILayoutComponent = {
        name: 'promo.wlc-jackpots-slider',
        params: <IJackpotsSliderCParams>{
            theme: '1',
            wlcElement: 'wlc-jackpots-slider',
            sliderParams: {
                slidesPerView: 4,
            },
        },
    };
}
