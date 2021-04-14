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

    export const catalog: ILayoutComponent = {
        name: 'promo.wlc-banners-slider',
        params: {
            class: 'wlc-slider',
            theme: 'default-banner',
            filter: {
                position: ['catalog'],
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

    export const affiliates: ILayoutComponent = {
        name: 'promo.wlc-banners-slider',
        params: {
            class: 'wlc-slider',
            theme: 'default-banner',
            filter: {
                position: ['affiliates'],
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
