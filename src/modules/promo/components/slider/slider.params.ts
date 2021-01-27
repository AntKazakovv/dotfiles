import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import { Type, TemplateRef, Injector } from '@angular/core';
import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

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
