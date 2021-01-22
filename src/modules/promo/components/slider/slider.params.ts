import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import { Type, TemplateRef, Injector } from '@angular/core';
import {IWinnerCParams} from './../winner/winner.component';
import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {IBannersFilter} from 'wlc-engine/modules/promo/system/services/banners/banners.service';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

/**
 * Options for slide banner.
*/
export interface IBannerSlide {
    filter: IBannersFilter;
};

export interface IWinnerSlide {
    request: 'latest' | 'biggest',
    params?: IWinnerCParams,
};

export type SlideType = 'banner' | 'winner';
export type SlideParamsType = IBannerSlide | IWinnerSlide;
/**
 * Takes the name of the component and its parameters.
 */
export interface ISlide {
    /** Allow to past Component */
    component?: Type<any>;
    componentParams?: any;
    injector?: Injector;

    /** Allow to past TemplateRef */
    templateRef?: TemplateRef<any>;
    templateParams?: any;

    /** Allow to Past html string */
    htmlString?: string;
}

export interface ISliderCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /**
     * Accepts a set of slide-generating components.
     */
    slides?: ISlide[];
    /**
     * In parameters it takes the slick slider config (params.swiper).
     * See more: [slick docs]{@link https://kenwheeler.github.io/slick/}.
     */
    swiper?: SwiperConfigInterface;
    /**
     * Component class. The default is "wlc-slider".
     */
    class?: string;
};

export const defaultParams: ISliderCParams = {
    class: 'wlc-slider',
};
