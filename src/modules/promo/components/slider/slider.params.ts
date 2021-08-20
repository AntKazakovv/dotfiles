import {
    Type,
    TemplateRef,
    Injector,
} from '@angular/core';
import {SwiperOptions} from 'swiper';

import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'ears' | CustomType;

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
    slidesAspectRatio?: string;
    /**
     * Accepts a set of slide-generating components.
     */
    slides?: ISlide[];
    /**
     * In parameters it takes the slick slider config (params.swiper).
     * See more: [slick docs]{@link https://kenwheeler.github.io/slick/}.
     */
    swiper?: SwiperOptions;
    /**
     * Component class. The default is "wlc-slider".
     */
    class?: string;
};

export const defaultParams: ISliderCParams = {
    class: 'wlc-slider',
};
