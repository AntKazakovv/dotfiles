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

    export const transparent: ILayoutComponent = {
        name: 'promo.wlc-winners-slider',
        params: <IWinnersSliderCParams>{
            type: 'latest',
            theme: 'transparent',
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

    export const withPromoCategories: ILayoutComponent = {
        name: 'promo.wlc-winners-slider',
        params: <IWinnersSliderCParams>{
            type: 'latest',
            theme: 'vertical',
            title: gettext('Recent wins'),
            wlcElement: 'section_last-winners',
            swiper: {
                breakpoints: {
                    320: {
                        slidesPerView: 3,
                    },
                    900: {
                        slidesPerView: 4,
                    },
                    1024: {
                        slidesPerView: 5,
                    },
                    1630: {
                        slidesPerView: 4,
                    },
                },
            },
        },
    };

    export const stripe: ILayoutComponent =
    {
        name: 'promo.wlc-winners-slider',
        params: {
            type: 'latest',
            wlcElement: 'section_last-winners',
        },
    };

    export const stripeWithTitle: ILayoutComponent = {
        name: 'promo.wlc-winners-slider',
        params: {
            type: 'latest',
            title: gettext('Last Winners:'),
            wlcElement: 'section_last-winners',
        },
    };

    export const bannerPlusOne: ILayoutComponent = {
        name: 'promo.wlc-winners-slider',
        display: {
            auth: false,
            after: 1200,
        },
        params: <IWinnersSliderCParams>{
            type: 'latest',
            theme: 'vertical',
            title: gettext('Recent wins'),
            wlcElement: 'section_last-winners',
            swiper: {
                breakpoints: {
                    1200: {
                        slidesPerView: 4,
                    },
                },
            },
        },
    };
}
