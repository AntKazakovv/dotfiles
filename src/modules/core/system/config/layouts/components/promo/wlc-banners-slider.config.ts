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
                    autoplay: {
                        delay: 10000,
                    },
                    lazy: true,
                    breakpoints: {
                        375: {
                            pagination: {
                                enabled: true,
                                clickable: true,
                            },
                        },
                        768: {
                            pagination: {
                                enabled: false,
                            },
                        },
                    },
                },
            },
            showNavigationOn: 'desktop',
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
                    navigation: {
                        nextEl: '.wlc-slider--theme-default-banner .wlc-swiper-button-next',
                        prevEl: '.wlc-slider--theme-default-banner .wlc-swiper-button-prev',
                    },
                    autoplay: {
                        delay: 10000,
                    },
                    breakpoints: {
                        375: {
                            pagination: {
                                enabled: true,
                                clickable: true,
                            },
                        },
                        768: {
                            pagination: {
                                enabled: false,
                            },
                        },
                        1366: {
                            slidesPerView: 1.2,
                            spaceBetween: 30,
                        },
                    },
                },
            },
            showNavigationOn: 'desktop',
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
                    autoplay: {
                        delay: 10000,
                    },
                    lazy: true,
                    breakpoints: {
                        375: {
                            pagination: {
                                enabled: true,
                                clickable: true,
                            },
                        },
                        768: {
                            pagination: {
                                enabled: false,
                            },
                        },
                    },
                },
            },
            showNavigationOn: 'desktop',
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
