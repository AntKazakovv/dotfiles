import {
    Type,
    TemplateRef,
    Injector,
} from '@angular/core';
import {RawParams} from '@uirouter/core';

import {Subject} from 'rxjs';
import {SwiperOptions} from 'swiper/types/swiper-options';
import {NavigationOptions} from 'swiper/types/modules/navigation';
import {Swiper} from 'swiper/types';

import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'ears' | CustomType;

export type SwiperEventName = 'start'
    | 'stop'
    | 'enable'
    | 'disable'
    | 'slideTo'
    | 'update'
    | 'scrollToStart';

export interface ISwiperEvent<Data = unknown> {
    name: SwiperEventName;
    data?: Data;
}


export type OnSlideChangeTransitionEnd = (v: Swiper) => void;

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
    useStartTimeout?: boolean;
    slidesAspectRatio?: string;
    /**
     * Accepts a set of slide-generating components.
     */
    slides?: ISlide[];
    /**
     * In parameters it takes the SwiperOptions (params.swiper).
     * See more: [swiper docs]{@link https://swiperjs.com/types/interfaces/types_swiper_options.SwiperOptions}.
     */
    swiper?: SwiperOptions;
    /**
     * Component class. The default is "wlc-slider".
     */
    class?: string;
    events?: Subject<ISwiperEvent>;
    slideShowAll?: {
        use: boolean;
        sref: string;
        text?: string;
        srefParams?: RawParams;
    },
    /**
     * If 'true' enable parameter centeredSlides and centeredSlidesBounds. 'false' is default.
     */
    centeredSlides?: boolean;
};

export const defaultParams: ISliderCParams = {
    class: 'wlc-slider',
    swiper: {},
    slideShowAll: {
        use: false,
        text: gettext('Show all'),
        sref: '',
    },
    useStartTimeout: false,
    centeredSlides: false,
};

export const defaultNavigationParams: NavigationOptions = {
    disabledClass: 'swiper-button-disabled',
    hiddenClass: 'swiper-button-hidden',
    hideOnClick: false,
    lockClass: 'swiper-button-lock',
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
};
