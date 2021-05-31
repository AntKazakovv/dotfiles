import {ILayoutComponent} from 'wlc-engine/modules/core';
import {ICRecommendedBonusesParams} from 'wlc-engine/modules/bonuses/components/recommended-bonuses/recommended-bonuses.params';

export namespace wlcRecommendedBonuses {
    export const def: ILayoutComponent = {
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
                common: {
                    useQuery: true,
                    useRecommendedBonuses: true,
                    filterByGroup: 'recommended',
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
                                spaceBetween: 15,
                            },
                            720: {
                                slidesPerView: 2,
                                spaceBetween: 15,
                            },
                            1630: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                        },
                    },
                },
            },
        },
    };
}
;
