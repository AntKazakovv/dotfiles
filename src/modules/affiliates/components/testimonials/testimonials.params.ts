import {IComponentParams, ISliderCParams} from 'wlc-engine/modules/core';

export interface ITestimonialsCParams extends IComponentParams<string, string, string> {
    slug: string;
    sliderParams?: ISliderCParams;
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
        swiper: {
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
    },
};
