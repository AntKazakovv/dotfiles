import {SwiperOptions} from 'swiper';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IBannersFilter} from 'wlc-engine/modules/promo/system/services/banners/banners.service';
import {IBannerParams} from './../banner/banner.params';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IBannersSliderCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    filter?: IBannersFilter;
    swiper?: SwiperOptions;
    banner?: IBannerParams,
};

export const defaultParams: IBannersSliderCParams = {
    class: 'wlc-banners-slider',
    swiper: {
        slidesPerView: 1,
        loop: true,
        pagination: {
            clickable: true,
        },
    },
};
