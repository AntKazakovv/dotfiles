import {SwiperOptions} from 'swiper/types/swiper-options';

import {
    CustomType,
    IComponentParams,
    IIndexing,
} from 'wlc-engine/modules/core';
import {INoContentCParams} from 'wlc-engine/modules/core/components/no-content/no-content.params';

export type JackpotsSliderType = CustomType;
export type JackpotsSliderTheme = 'default' | '1' | 'vertical' | CustomType;
export type JackpotsSliderThemeMod = CustomType;
export type JackpotsSliderNoContentByThemeType = Partial<Record<JackpotsSliderTheme, INoContentCParams>>;

export interface IJackpotsSliderCParams
    extends IComponentParams<JackpotsSliderTheme, JackpotsSliderType, JackpotsSliderThemeMod> {
    title?: string;
    sliderParams?: SwiperOptions;
    noContent?: JackpotsSliderNoContentByThemeType;
};

export const defaultParams: Partial<IJackpotsSliderCParams> = {
    class: 'wlc-jackpots-slider',
    moduleName: 'promo',
    componentName: 'wlc-jackpots-slider',
    theme: '1',
    title: gettext('Jackpots'),
};

export const swiperParamsDefault: IIndexing<SwiperOptions> = {
    1: {
        direction: 'vertical',
        slidesPerView: 3,
        spaceBetween: 15,
        loop: true,
        autoplay: {
            disableOnInteraction: false,
        },
        watchSlidesProgress: true,
        observer: true,
        observeParents: true,
        preventClicks: false,
        breakpoints: {
            320: {
                followFinger: false,
            },
            1024: {
                followFinger: true,
            },
            1630: {
                slidesPerView: 4,
            },
        },
    },
    vertical: {
        direction: 'vertical',
        slidesPerView: 4,
        spaceBetween: 18,
        loop: true,
        autoplay: {
            disableOnInteraction: false,
        },
        watchSlidesProgress: true,
        observer: true,
        observeParents: true,
        preventClicks: false,
    },
};
