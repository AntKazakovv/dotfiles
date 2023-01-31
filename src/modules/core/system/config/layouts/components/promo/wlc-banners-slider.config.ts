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
                        nextEl: '.wlc-slider--theme-default-banner .wlc-swiper-button-next',
                        prevEl: '.wlc-slider--theme-default-banner .wlc-swiper-button-prev',
                    },
                    pagination: {
                        enable: true,
                        clickable: true,
                    },
                    autoplay: {
                        delay: 10000,
                    },
                    lazy: true,
                },
            },
        },
    };

    export const withEars: ILayoutComponent = {
        name: 'promo.wlc-banners-slider',
        params: {
            class: 'wlc-slider',
            theme: 'default-banner',
            themeMod: 'ears',
            filter: {
                position: ['home'],
            },
            sliderParams: {
                swiper: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    centeredSlides: true,
                    loopedSlides: 2,
                    loopAdditionalSlides: 3,
                    navigation: {
                        nextEl: '.wlc-slider--theme-default-banner .wlc-swiper-button-next',
                        prevEl: '.wlc-slider--theme-default-banner .wlc-swiper-button-prev',
                    },
                    pagination: false,
                    autoplay: {
                        delay: 10000,
                    },
                    breakpoints: {
                        1366: {
                            slidesPerView: 1.2,
                            spaceBetween: 30,
                        },
                    },
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
                        nextEl: '.wlc-slider--theme-default-banner .wlc-swiper-button-next',
                        prevEl: '.wlc-slider--theme-default-banner .wlc-swiper-button-prev',
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

    export const wide: ILayoutComponent = {
        name: 'promo.wlc-banners-slider',
        params: {
            class: 'wlc-slider',
            theme: 'default-banner',
            filter: {
                position: ['home'],
            },
            sliderParams: {
                theme: 'default-banner',
                themeMod: 'wide',
                swiper: {
                    slidesPerView: 1,
                    navigation: {
                        nextEl: '.wlc-slider--theme-default-banner .wlc-swiper-button-next',
                        prevEl: '.wlc-slider--theme-default-banner .wlc-swiper-button-prev',
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
