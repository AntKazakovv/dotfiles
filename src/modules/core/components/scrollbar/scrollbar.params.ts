import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/classes/abstract.component';

export type ScrollbarTheme = 'default' | CustomType;

export interface IScrollbarCParams extends IComponentParams<ScrollbarTheme, string, string> {
    //
};

export const defaultParams: IScrollbarCParams = {
    class: 'wlc-scrollbar',
};

export const defaultSwiperOptions: SwiperConfigInterface = {
    direction: 'vertical',
    slidesPerView: 'auto',
    freeMode: true,
    scrollbar: {
        el: '.swiper-scrollbar',
        hide: false,
    },
    mousewheel: true,
    freeModeMomentum: false,
    freeModeMomentumBounce: false,
};
