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
                    navigation: true,
                    breakpoints: {
                        320: {
                            slidesPerView: 'auto',
                            spaceBetween: 10,
                        },
                        560: {
                            slidesPerView: 'auto',
                            spaceBetween: 10,
                        },
                        680: {
                            slidesPerView: 'auto',
                            spaceBetween: 10,
                        },
                        720: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        900: {
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
                        1420: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                    },
                },
            },
        },
    };
}
