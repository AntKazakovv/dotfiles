import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import {
    ICRecommendedBonusesParams,
    IBonusesListCParams,
} from 'wlc-engine/modules/bonuses';

export namespace wlcRecommendedBonuses {
    export const def: ILayoutComponent = {
        name: 'bonuses.wlc-recommended-bonuses',
        params: <ICRecommendedBonusesParams>{
            common: {
                restType: 'active',
                filter: 'active',
                useQuery: true,
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
                    descriptionClamp: 4,
                },
            },
            useNoDataText: true,
            recommendParams: <IBonusesListCParams>{
                type: 'swiper',
                theme: 'default',
                inProfile: true,
                wlcElement: 'block_bonuses-main',
                itemsParams: {
                    themeMod: 'with-image',
                    common: {
                        useIconBonusImage: false,
                        showAdditionalImage: true,
                    },
                },
                common: {
                    useQuery: true,
                    useRecommendedBonuses: true,
                    filterByGroup: 'recommended',
                    sortOrder: ['subscribe'],
                    swiper: {
                        slidesPerView: 3,
                        navigation: {
                            nextEl: '.wlc-bonuses-list .wlc-swiper-button-next',
                            prevEl: '.wlc-bonuses-list .wlc-swiper-button-prev',
                        },
                        pagination: false,
                        spaceBetween: 20,
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
                            1024: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                                followFinger: true,
                            },
                            1200: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                        },
                    },
                },
            },
        },
    };

    export const withEars: ILayoutComponent = {
        name: 'bonuses.wlc-recommended-bonuses',
        params: <ICRecommendedBonusesParams>{
            common: {
                restType: 'active',
                filter: 'active',
                useQuery: true,
            },
            itemsParams: {
                common: {
                    themeMod: 'active',
                    useIconBonusImage: false,
                    showAdditionalImage: true,
                    descriptionClamp: 3,
                },
            },
            useNoDataText: true,
            recommendParams: <ICRecommendedBonusesParams>{
                type: 'swiper',
                theme: 'default',
                wlcElement: 'block_bonuses-main',
                themeMod: 'with-ears',
                hideNavigation: true,
                itemsParams: {
                    themeMod: 'with-image',
                    common: {
                        useIconBonusImage: false,
                        showAdditionalImage: true,
                    },
                },
                common: {
                    useQuery: true,
                    useRecommendedBonuses: true,
                    filterByGroup: 'recommended',
                    sortOrder: ['subscribe'],
                    swiper: {
                        navigation: false,
                        pagination: false,
                        spaceBetween: 20,
                        breakpoints: {
                            320: {
                                slidesPerView: 1.1,
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            480: {
                                slidesPerView: 1.35,
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            560: {
                                slidesPerView: 1.6,
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            640: {
                                slidesPerView: 2.1,
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            768: {
                                slidesPerView: 2.2,
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            900: {
                                slidesPerView: 2.6,
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            1024: {
                                slidesPerView: 2.1,
                                spaceBetween: 20,
                                followFinger: true,
                            },
                            1200: {
                                slidesPerView: 3.1,
                                spaceBetween: 10,
                            },
                        },
                    },
                },
            },
        },
    };

    export const generateConfig = (recommendedWithEars: boolean): ILayoutComponent => {
        return recommendedWithEars ? withEars : def;
    };
}
