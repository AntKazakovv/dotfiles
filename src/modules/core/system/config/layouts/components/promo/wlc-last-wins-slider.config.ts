import {ILayoutComponent} from 'wlc-engine/modules/core';
import {IWinnersSliderCParams} from 'wlc-engine/modules/promo';

export namespace wlcLastWinsSlider {
    export const def: ILayoutComponent = {
        name: 'promo.wlc-winners-slider',
        params: <IWinnersSliderCParams>{
            type: 'latest',
            theme: 'vertical',
            title: gettext('Recent wins'),
            wlcElement: 'section_last-winners',
        },
    };

    export const one: ILayoutComponent = {
        name: 'promo.wlc-winners-slider',
        display: {
            after: 900,
        },
        params: <IWinnersSliderCParams>{
            type: 'latest',
            theme: '1',
            title: gettext('Recent wins'),
            wlcElement: 'section_last-winners',
        },
    };

    export const alongWithTournament: ILayoutComponent = {
        name: 'promo.wlc-winners-slider',
        params: <IWinnersSliderCParams>{
            type: 'latest',
            theme: 'vertical',
            themeMod: 'along-with-tournament',
            title: gettext('Recent wins'),
            wlcElement: 'section_last-winners',
            noContent: {
                latest: {
                    vertical: {
                        bgImage: '/gstatic/wlc/bonuses/no-bonuses/no-bonus-block-background.jpg',
                    },
                },
            },
            swiper: {
                breakpoints: {
                    320: {
                        slidesPerView: 3,
                    },
                    1200: {
                        slidesPerView: 4,
                    },
                },
            },
        },
    };
}
