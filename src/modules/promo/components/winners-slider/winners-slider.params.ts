import {SwiperOptions} from 'swiper';

import {
    CustomType,
    IComponentParams,
    IIndexing,
} from 'wlc-engine/modules/core';
import {INoContentCParams} from 'wlc-engine/modules/core/components/no-content/no-content.params';
import {IWinnerCParams} from 'wlc-engine/modules/promo/components/winner/winner.params';

export type WinnersSliderType = 'latest' | 'biggest';
export type WinnersSliderTheme = 'default' | 'vertical' | '1' | 'transparent' | CustomType;
export type WinnersSliderThemeMod = 'default' | 'vertical' | 'along-with-tournament' | CustomType;
export type NoContentByThemeType = Partial<Record<WinnersSliderTheme, INoContentCParams>>;
export type WinnersSliderNoContentByThemeType = Partial<Record<WinnersSliderType, NoContentByThemeType>>;

export interface IWinnersSliderCParams extends
    IComponentParams<WinnersSliderTheme, WinnersSliderType, WinnersSliderThemeMod> {
    type: WinnersSliderType,
    title?: string,
    winner?: IWinnerCParams;
    swiper?: SwiperOptions;
    container?: boolean;
    noContent?: WinnersSliderNoContentByThemeType;
};

export const defaultParams: IWinnersSliderCParams = {
    class: 'wlc-winners-slider',
    moduleName: 'promo',
    componentName: 'wlc-winners-slider',
    type: 'latest',
    theme: 'default',
};

export const swiperParamsDefault: IIndexing<SwiperOptions> = {
    default: {
        slidesPerView: 5,
        spaceBetween: 22,
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
                slidesPerView: 1,
            },
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            },
            1630: {
                slidesPerView: 5,
            },
        },
    },
    vertical: {
        direction: 'vertical',
        slidesPerView: 4,
        spaceBetween: 10,
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
    transparent: {
        direction: 'vertical',
        slidesPerView: 3,
        spaceBetween: 10,
        loop: true,
        autoplay: {
            disableOnInteraction: false,
        },
        watchSlidesVisibility: true,
        observer: true,
        observeParents: true,
        preventClicks: false,
    },
    1: {
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
};
