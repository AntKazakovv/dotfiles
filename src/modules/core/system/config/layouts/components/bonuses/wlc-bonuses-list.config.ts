import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcBonusesList {
    export const main: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            common: {
                title: '',
                filter: 'main',
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
            common: {
                sortOrder: ['active', 'subscribe', 'inventory'],
                title: 'My bonuses',
                swiper: {
                    slidesPerView: 4,
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
                            slidesPerView: 2,
                        },
                        1200: {
                            slidesPerView: 3,
                        },
                        1420: {
                            slidesPerView: 4,
                        },
                    },
                },
            },
        },
    };
}
