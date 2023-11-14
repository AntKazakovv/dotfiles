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
                },
            },
            useNoDataText: true,
            recommendParams: <IBonusesListCParams>{
                type: 'swiper',
                theme: 'default',
                inProfile: true,
                wlcElement: 'block_bonuses-main',
                placement: 'profile-recommended',
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
                    sortOrder: ['promocode'],
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
                },
            },
            useNoDataText: true,
            recommendParams: <ICRecommendedBonusesParams>{
                type: 'swiper',
                theme: 'default',
                wlcElement: 'block_bonuses-main',
                themeMod: 'with-ears',
                placement: 'profile-recommended',
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
                    sortOrder: ['promocode'],
                    swiper: {
                        navigation: false,
                        pagination: false,
                        spaceBetween: 10,
                        slidesPerView: 'auto',
                        followFinger: false,
                        breakpoints: {
                            320: {
                                slidesPerView: 'auto',
                            },
                            640: {
                                slidesPerView: 'auto',
                            },
                            1024: {
                                slidesPerView: 'auto',
                                spaceBetween: 20,
                                followFinger: true,
                            },
                            1200: {
                                slidesPerView: 'auto',
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
