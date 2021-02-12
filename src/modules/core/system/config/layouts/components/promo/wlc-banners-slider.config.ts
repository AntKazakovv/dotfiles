import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcBannersSlider {
    export const home: ILayoutComponent = {
        name: 'promo.wlc-banners-slider',
        params: {
            class: 'wlc-slider',
            theme: 'default-banner',
            filter: {
                position: ['home'],
            },
            sliderParams: {
                theme: 'default-banner',
                swiper: {
                    slidesPerView: 1,
                    navigation: {
                        nextEl: '.wlc-swiper-button-next',
                        prevEl: '.wlc-swiper-button-prev',
                    },
                    pagination: false,
                    autoplay: {
                        delay: 10000,
                    },
                    lazy: true,
                },
            },
        },
    };
}
