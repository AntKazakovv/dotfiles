import {IComponentParams} from 'wlc-engine/modules/core';
import {SwiperOptions} from 'swiper';

export interface ITestimonialsCParams extends IComponentParams<string, string, string> {
    slug: string;
    sliderParams: SwiperOptions;
    showErrors?: boolean;
    title?: string;
}

export interface ITestimonialsData {
    content: string;
    logo: string,
    linkTitle: string,
    linkHref: string,
}

export const defaultParams: ITestimonialsCParams = {
    moduleName: 'affiliates',
    componentName: 'wlc-testimonials',
    class: 'wlc-testimonials',
    slug: 'partners-testimonials',
    showErrors: true,
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
