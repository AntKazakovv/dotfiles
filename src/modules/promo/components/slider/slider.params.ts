import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {IComponentParams} from 'wlc-engine/interfaces/config.interface';
import {IBannersFilter} from 'wlc-engine/modules/promo/services/banners/banners.service';

export type ComponentTheme = 'default';
export type ComponentType = 'default';

/**
 * Options for slide banner.
*/
interface IBannerSlide {
    filter: IBannersFilter;
}

/**
 * Takes the name of the component and its parameters.
 */
export interface ISlides {
    component: 'banner';
    params: IBannerSlide;
}

export interface ISliderParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    /**
     * Accepts a set of slide-generating components.
     */
    slides?: ISlides[];
    /**
     * In parameters it takes the slick slider config (params.swiper).
     * See more: [slick docs]{@link https://kenwheeler.github.io/slick/}.
     */
    swiper?: SwiperConfigInterface;
    /**
     * Component class. The default is "wlc-slider".
     */
    class?: string;
}

export const defaultParams: ISliderParams = {
    class: 'wlc-slider',
};
