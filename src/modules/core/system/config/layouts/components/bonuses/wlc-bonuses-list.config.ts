import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcBonusesList {
    export const main: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            common: {
                title: '',
                filter: 'main',
                sortOrder: ['active', 'subscribe', 'inventory'],
            },
        },
    };
    export const active: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            common: {
                title: '',
                restType: 'active',
                filter: 'active',
            },
        },
    };
    export const inventory: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            common: {
                title: '',
                filter: 'inventory',
            },
        },
    };
    export const dashboard: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            type: 'swiper',
            wlcElement: 'block_bonuses',
            common: {
                sortOrder: ['active', 'subscribe', 'inventory'],
                title: '',
                swiper: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    loop: false,
                    navigation: true,
                    breakpoints: {
                        320: {
                            slidesPerView: 1,
                        },
                        560: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 1,
                        },
                        900: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 1,
                        },
                        1200: {
                            slidesPerView: 2,
                        },
                        1420: {
                            slidesPerView: 2,
                        },
                    },
                },
            },
        },
    };
}
