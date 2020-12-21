import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {ISlide} from 'wlc-engine/modules/promo/components/slider/slider.params';
import {IWinnerCParams} from 'wlc-engine/modules/promo/components/winner/winner.params';

export type WinnersSliderType = 'latest' | 'biggest';
export type WinnersSliderTheme = 'default' | 'vertical' | CustomType;
export type WinnersSliderThemeMod = 'default' | 'vertical' | CustomType;

export interface IWinnersSliderCParams extends
    IComponentParams<WinnersSliderTheme, WinnersSliderType, WinnersSliderThemeMod> {
    type: WinnersSliderType,
    title?: string,
    winner?: IWinnerCParams;
    swiper?: SwiperConfigInterface;
};

export const defaultParams: IWinnersSliderCParams = {
    class: 'wlc-winners-slider',
    type: 'latest',
};

export const swiperParamsDefault: IIndexing<SwiperConfigInterface> = {
    default: {
        slidesPerView: 5,
        spaceBetween: 22,
        loop: true,
        autoplay: true,
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            560: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            },
            1420: {
                slidesPerView: 5,
            },
        },
    },
    vertical: {
        direction: 'vertical',
        slidesPerView: 4,
        loopedSlides: 4,
        spaceBetween: 10,
        loop: true,
        autoplay: true,
    },
};
