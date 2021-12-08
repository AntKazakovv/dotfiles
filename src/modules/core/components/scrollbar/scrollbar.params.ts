import {SwiperOptions} from 'swiper';
import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ScrollbarTheme = 'default' | CustomType;

export interface IScrollbarCParams extends IComponentParams<ScrollbarTheme, string, string> {
    //
};

export const defaultParams: IScrollbarCParams = {
    class: 'wlc-scrollbar',
};

export const defaultSwiperOptions: SwiperOptions = {
    direction: 'vertical',
    slidesPerView: 'auto',
    mousewheel: true,
    updateOnWindowResize: false,
    scrollbar: true,
    freeMode: {
        enabled: true,
        momentum: false,
        momentumBounce: false,
    },
};
