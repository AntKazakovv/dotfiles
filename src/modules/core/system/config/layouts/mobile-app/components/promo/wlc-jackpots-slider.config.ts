import {ILayoutComponent} from 'wlc-engine/modules/core';
import {IJackpotsSliderCParams} from 'wlc-engine/modules/promo/components/jackpots-slider/jackpots-slider.params';

export namespace wlcJackpotsSlider {

    export const one: ILayoutComponent = {
        name: 'promo.wlc-jackpots-slider',
        params: <IJackpotsSliderCParams>{
            sliderParams: {
                swiper: {
                    slidesPerView: 4,
                },
            },
        },
    };
}
