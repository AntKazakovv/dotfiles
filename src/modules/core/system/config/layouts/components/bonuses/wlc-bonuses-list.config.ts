import {IBonusesListCParams} from 'wlc-engine/modules/bonuses';
import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcBonusesList {
    export const main: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: <IBonusesListCParams>{
            common: {
                filter: 'main',
                useQuery: true,
                sortOrder: ['active', 'inventory', 'promocode', 'subscribe'],
                pagination: {
                    use: true,
                    breakpoints: {
                        0: {
                            itemPerPage: 3,
                        },
                        640: {
                            itemPerPage: 4,
                        },
                        720: {
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
                useQuery: true,
                sortOrder: ['active', 'inventory', 'promocode', 'subscribe'],
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
    export const mainFirstWithNoOffersImage: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            themeMod: 'with-image',
            common: {
                filter: 'main',
                useQuery: true,
                sortOrder: ['active', 'promocode', 'subscribe', 'inventory'],
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
                useNoOffersItem: true,
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
                useQuery: true,
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
                useQuery: true,
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
    export const activeFirstWithNoBonusItem: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: {
            theme: 'active',
            common: {
                restType: 'active',
                useQuery: true,
                filter: 'active',
                useNoActiveItem: true,
                pagination: {
                    use: true,
                    breakpoints: {
                        0: {
                            itemPerPage: 10,
                        },
                    },
                },
            },
            itemsParams: {
                common: {
                    themeMod: 'active',
                    useIconBonusImage: false,
                    showAdditionalImage: true,
                    descriptionClamp: 3,
                },
            },
            useBtnScroll: true,
        },
    };

    export const inventory: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: <IBonusesListCParams>{
            common: {
                useQuery: true,
                filter: 'inventory',
                pagination: {
                    use: true,
                    breakpoints: {
                        0: {
                            itemPerPage: 3,
                        },
                        640: {
                            itemPerPage: 4,
                        },
                        720: {
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
    export const dashboard: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: <IBonusesListCParams>{
            type: 'swiper',
            wlcElement: 'block_bonuses-main',
            common: {
                useQuery: true,
                sortOrder: ['active', 'inventory', 'promocode', 'subscribe'],
                swiper: {
                    nested: true,
                    slidesPerView: 2,
                    spaceBetween: 20,
                    navigation: {
                        nextEl: '.wlc-swiper-button-next',
                        prevEl: '.wlc-swiper-button-prev',
                    },
                    observer: true,
                    observeSlideChildren: true,
                    breakpoints: {
                        320: {
                            slidesPerView: 1,
                            spaceBetween: 10,
                            followFinger: false,
                        },
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                            followFinger: false,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                            followFinger: false,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 15,
                            followFinger: true,
                        },
                        1366: {
                            slidesPerView: 2,
                            spaceBetween: 15,
                        },
                        1630: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                    },
                },
            },
        },
    };
    export const dashboardWithEars: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: <IBonusesListCParams>{
            type: 'swiper',
            wlcElement: 'block_bonuses-main',
            themeMod: 'with-ears',
            hideNavigation: true,
            common: {
                useQuery: true,
                sortOrder: ['active', 'subscribe', 'inventory'],
                swiper: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    loop: false,
                    observer: true,
                    observeSlideChildren: true,
                    breakpoints: {
                        320: {
                            slidesPerView: 1.1,
                            spaceBetween: 10,
                        },
                        480: {
                            slidesPerView: 1.4,
                            spaceBetween: 10,
                        },
                        560: {
                            slidesPerView: 1.6,
                            spaceBetween: 10,
                        },
                        640: {
                            slidesPerView: 2.1,
                            spaceBetween: 10,
                        },
                        768: {
                            slidesPerView: 2.3,
                            spaceBetween: 10,
                        },
                        900: {
                            slidesPerView: 2.7,
                            spaceBetween: 10,
                        },
                        1024: {
                            slidesPerView: 2.9,
                            spaceBetween: 15,
                        },
                        1366: {
                            slidesPerView: 2.1,
                            spaceBetween: 15,
                        },
                        1630: {
                            slidesPerView: 1.9,
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
            title: gettext('Bonus'),
            wlcElement: 'block_bonuses-main',
            common: {
                sortOrder: ['active', 'inventory', 'promocode', 'subscribe'],
                swiper: {
                    slidesPerView: 1,
                    navigation: {
                        nextEl: '.wlc-bonuses-list .wlc-swiper-button-next',
                        prevEl: '.wlc-bonuses-list .wlc-swiper-button-prev',
                    },
                    pagination: false,
                    lazy: true,
                    spaceBetween: 20,
                    breakpoints: {
                        320: {
                            followFinger: false,
                        },
                        1024: {
                            followFinger: true,
                        },
                    },
                },
            },
            itemsParams: {
                common: {
                    nameClamp: 2,
                },
            },
        },
    };
    export const bannerPlusOne: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        display: {
            auth: true,
            after: 1200,
        },
        params: <IBonusesListCParams> {
            type: 'swiper',
            theme: 'promo-home',
            title: gettext('Bonus'),
            wlcElement: 'block_bonuses-main',
            common: {
                sortOrder: ['active', 'inventory', 'promocode', 'subscribe'],
                swiper: {
                    slidesPerView: 1,
                    navigation: {
                        nextEl: '.wlc-bonuses-list .wlc-swiper-button-next',
                        prevEl: '.wlc-bonuses-list .wlc-swiper-button-prev',
                    },
                    lazy: true,
                    loop: true,
                },
            },
        },
    };
}
