import {ILayoutComponent} from 'wlc-engine/modules/core';
import {SwiperOptions} from 'swiper/types/swiper-options';
import {ITournamentListCParams} from 'wlc-engine/modules/tournaments';

export namespace wlcTournamentBannersSlider {
    export const def: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            components: [
                {
                    name: 'tournaments.wlc-tournament-list',
                    params: <ITournamentListCParams>{
                        type: 'banner',
                        themeMod: 'swiper',
                        common: {
                            thumbType: 'banner',
                            swiper: <SwiperOptions>{
                                slidesPerView: 1,
                                spaceBetween: 5,
                                pagination: false,
                                lazy: true,
                                followFinger: false,
                            },
                        },
                    },
                },
            ],
        },
    };

    export const wolf: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            components: [
                {
                    name: 'tournaments.wlc-tournament-list',
                    params: <ITournamentListCParams>{
                        type: 'banner',
                        themeMod: 'swiper',
                        common: {
                            thumbType: 'banner',
                            swiper: <SwiperOptions>{
                                slidesPerView: 1.1,
                                spaceBetween: 12,
                                pagination: false,
                                lazy: true,
                                followFinger: true,
                                breakpoints: {
                                    560: {
                                        slidesPerView: 1,
                                        spaceBetween: 12,
                                    },
                                    720: {
                                        slidesPerView: 1,
                                        spaceBetween: 20,
                                    },
                                },
                            },
                        },
                    },
                },
            ],
        },
    };
}
