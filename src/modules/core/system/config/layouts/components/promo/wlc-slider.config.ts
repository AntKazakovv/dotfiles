import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcSlider {
    export const catalog: ILayoutComponent = {
        name: 'promo.wlc-slider',
        params: {
            class: 'container wlc-slider',
            slides: [
                {
                    component: 'banner',
                    params: {
                        filter: {
                            position: ['home'],
                        },
                    },
                },
            ],
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
