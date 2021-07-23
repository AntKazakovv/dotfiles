import {IBonusesListCParams} from 'wlc-engine/modules/bonuses';
import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcBonusesList {
    export const main: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            common: {
                filter: 'main',
                sortOrder: ['active', 'subscribe', 'inventory'],
                pagination: {
                    use: true,
                    breakpoints: {
                        0: {
                            itemPerPage: 3,
                        },
                        720: {
                            itemPerPage: 4,
                        },
                        1024: {
                            itemPerPage: 6,
                        },
                        1366: {
                            itemPerPage: 8,
                        },
                        1630: {
                            itemPerPage: 6,
                        },
                    },
                },
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
                pagination: {
                    use: true,
                    breakpoints: {
                        0: {
                            itemPerPage: 3,
                        },
                        640: {
                            itemPerPage: 4,
                        },
                        1200: {
                            itemPerPage: 6,
                        },
                    },
                },
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
    export const activeFirst: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            theme: 'active',
            common: {
                restType: 'active',
                filter: 'active',
            },
            itemsParams: {
                common: {
                    themeMod: 'active',
                    useIconBonusImage: false,
                    showAdditionalImage: true,
                    descriptionClamp: 3,
                },
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
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        1024: {
                            spaceBetween: 10,
                            slidesPerView: 3,
                        },
                        1200: {
                            spaceBetween: 15,
                            slidesPerView: 3,
                        },
                        1366: {
                            spaceBetween: 15,
                            slidesPerView: 2,
                        },
                        1630: {
                            spaceBetween: 20,
                        },
                    },
                },
            },
        },
    };
    export const promoHome: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: <IBonusesListCParams>{
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
            itemsParams: {
                common: {
                    nameClamp: 2,
                },
            },
        },
    };
}
