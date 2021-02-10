import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcSlider {
    export const catalog: ILayoutComponent = {
        name: 'promo.wlc-banners-slider',
        params: {
            class: 'wlc-slider',
            theme: 'default-banner',
            filter: {
                position: ['catalog'],
            },
            sliderParams: {
                swiper: {
                    slidesPerView: 1,
                    navigation: {
                        nextEl: '.wlc-swiper-button-next',
                        prevEl: '.wlc-swiper-button-prev',
                    },
                    pagination: false,
                },
            },
        },
    };
};
