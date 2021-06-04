import {SwiperOptions} from 'swiper';

import {
    CustomType,
    IComponentParams,
    IIndexing,
} from 'wlc-engine/modules/core';

export type JackpotsSliderType = CustomType;
export type JackpotsSliderTheme =  'default' | '1' | CustomType;
export type JackpotsSliderThemeMod = CustomType;

export interface IJackpotsSliderCParams
    extends IComponentParams<JackpotsSliderTheme, JackpotsSliderType, JackpotsSliderThemeMod> {
        title?: string;
        sliderParams?: IIndexing<SwiperOptions>;
};

export const defaultParams: Partial<IJackpotsSliderCParams> = {
    class: 'wlc-jackpots-slider',
    theme: '1',
    title: gettext('Last jackpots'),
    sliderParams: {
        swiper: {
            direction: 'vertical',
            slidesPerView: 4,
            spaceBetween: 15,
            loop: true,
            autoplay: {
                disableOnInteraction: false,
            },
            watchSlidesVisibility: true,
            observer: true,
            observeParents: true,
            preventClicks: false,
            breakpoints: {
                320: {
                    slidesPerView: 3,
                },
                1630: {
                    slidesPerView: 4,
                },
            },
        },
    },
};
