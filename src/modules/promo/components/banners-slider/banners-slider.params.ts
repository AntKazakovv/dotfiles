import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ISliderCParams} from 'wlc-engine/modules/promo/components/slider/slider.params';
import {IBannersFilter} from 'wlc-engine/modules/promo/system/services/banners/banners.service';
import {IBannerCParams} from './../banner/banner.params';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IBannersSliderCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    filter?: IBannersFilter;
    banner?: IBannerCParams,
    sliderParams?: ISliderCParams;
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
        },
    },
};
