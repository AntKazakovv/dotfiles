import {ILayoutComponent} from 'wlc-engine/modules/core';
import {SwiperOptions} from 'swiper';
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
                                navigation: {
                                    nextEl: '.wlc-tournament-list .wlc-swiper-button-next',
                                    prevEl: '.wlc-tournament-list .wlc-swiper-button-prev',
                                },
                                pagination: false,
                                lazy: true,
                            },
                        },
                    },
                },
            ],
        },
    };
}
