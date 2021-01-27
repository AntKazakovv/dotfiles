import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcBannersSlider {
    export const home: ILayoutComponent = {
        name: 'promo.wlc-banners-slider',
        params: {
            class: 'wlc-slider',
            filter: {
                position: ['home'],
            },
            swiper: {
                slidesPerView: 1,
                pagination: {
                    clickable: true,
                    type: 'bullets',
                    el: '.swiper-pagination',
                },
            },
        },
    };
}
