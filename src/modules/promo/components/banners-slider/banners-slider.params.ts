import {
    IComponentParams,
    CustomType,
    ISliderCParams,
} from 'wlc-engine/modules/core';
import {IBannersFilter} from 'wlc-engine/modules/promo/system/services/banners/banners.service';
import {IBannerCParams} from './../banner/banner.params';

export type ComponentTheme = 'default' | 'default-banner' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'ears' | CustomType;

export type showNavigationOnParams = 'mobile' | 'desktop';

export interface IBannersSliderCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    filter?: IBannersFilter;
    banner?: IBannerCParams,
    sliderParams?: ISliderCParams;
    hideNavigation?: boolean;
    showNavigationOn?: showNavigationOnParams,
};

export const defaultParams: IBannersSliderCParams = {
    class: 'wlc-banners-slider',
    sliderParams: {
        swiper: {
            slidesPerView: 1,
            loop: true,
            pagination: {
                clickable: true,
            },
            preventClicks: true,
        },
    },
    hideNavigation: false,
};
