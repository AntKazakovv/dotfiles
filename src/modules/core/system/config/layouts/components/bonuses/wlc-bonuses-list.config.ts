import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcBonusesList {
    export const main: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            common: {
                filter: 'main',
                sortOrder: ['active', 'subscribe', 'inventory'],
            },
        },
    };
    export const mainFirst: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            themeMod: 'with-image',
            common: {
                filter: 'main',
                sortOrder: ['active', 'subscribe', 'inventory'],
            },
            itemsParams: {
                common: {
                    useIconBonusImage: false,
                    showAdditionalImage: true,
                },
            },
        },
    };
    export const active: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            common: {
                restType: 'active',
                filter: 'active',
            },
        },
    };
    export const inventory: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            common: {
                filter: 'inventory',
            },
        },
    };
    export const dashboard: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            type: 'swiper',
            wlcElement: 'block_bonuses-main',
            common: {
                sortOrder: ['active', 'subscribe', 'inventory'],
                swiper: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    loop: false,
                    navigation: {
                        nextEl: '.wlc-swiper-button-next',
                        prevEl: '.wlc-swiper-button-prev',
                    },
                    breakpoints: {
                        320: {
                            slidesPerView: 'auto',
                            spaceBetween: 10,
                        },
                        720: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 1,
                            spaceBetween: 20,
                        },
                        1200: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                    },
                },
            },
        },
    };
    export const promoHome: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            type: 'swiper',
            theme: 'promo-home',
            wlcElement: 'block_bonuses-main',
            common: {
                sortOrder: ['active', 'subscribe', 'inventory'],
                swiper: {
                    slidesPerView: 1,
                    navigation: {
                        nextEl: '.wlc-bonuses-list .wlc-swiper-button-next',
                        prevEl: '.wlc-bonuses-list .wlc-swiper-button-prev',
                    },
                    pagination: false,
                    lazy: true,
                    spaceBetween: 20,
                },
            },
        },
    };
}
