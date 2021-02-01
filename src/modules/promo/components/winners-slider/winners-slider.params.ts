import {SwiperOptions} from 'swiper';
import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {IWinnerCParams} from 'wlc-engine/modules/promo/components/winner/winner.params';

export type WinnersSliderType = 'latest' | 'biggest';
export type WinnersSliderTheme = 'default' | 'vertical' | CustomType;
export type WinnersSliderThemeMod = 'default' | 'vertical' | CustomType;

export interface IWinnersSliderCParams extends
    IComponentParams<WinnersSliderTheme, WinnersSliderType, WinnersSliderThemeMod> {
    type: WinnersSliderType,
    title?: string,
    winner?: IWinnerCParams;
    swiper?: SwiperOptions;
    container?: boolean;
};

export const defaultParams: IWinnersSliderCParams = {
    class: 'wlc-winners-slider',
    type: 'latest',
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
    },
};
