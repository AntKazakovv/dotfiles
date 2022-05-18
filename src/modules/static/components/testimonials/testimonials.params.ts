import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {SwiperOptions} from 'swiper';

export interface ITestimonialsCParams extends IComponentParams<string, string, string> {
    slug: string;
    sliderParams: SwiperOptions;
    common?: {
        showErrors?: boolean;
        title?: string;
    }
}

export interface ITestimonialsData {
    content: string;
    logo: string,
    linkTitle: string,
    linkHref: string,
}

export const defaultParams: ITestimonialsCParams = {
    class: 'wlc-testimonials',
    slug: 'partners-testimonials',
    sliderParams: {
        direction: 'horizontal',
        grabCursor: true,
        slidesPerView: 1,
        loop: true,
        autoplay: {
            delay: 5000,
        },
        pagination: {
            clickable: true,
        },
    },
};
