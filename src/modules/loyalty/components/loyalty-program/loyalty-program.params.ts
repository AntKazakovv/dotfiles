import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {ISliderCParams} from 'wlc-engine/modules/promo/components/slider/slider.params';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ILoyaltyProgramCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    title?: string;
    imagePath?: string;
    imageType?: string;
    decorLeftPath?: string;
    decorRightPath?: string;
    decorImageType?: string;
    levelsLimit?: number;
    /**
     * this text will be shown on empty state(when there is no content)
     */
    emptyStateText?: string;
    /**
     * Options overriding slider behavior
     */
    sliderParams?: ISliderCParams;
};

export const sliderDefaultParams: ISliderCParams = {
    swiper: {
        slidesPerView: 'auto',
        spaceBetween: 10,
        allowSlideNext: true,
        breakpoints: {
            768: {
                spaceBetween: 10,
            },
            1024: {
                spaceBetween: 20,
            },
        },
    },
};

export const defaultParams: ILoyaltyProgramCParams = {
    moduleName: 'loyalty',
    componentName: 'wlc-loyalty-program',
    class: 'wlc-loyalty-program',
    imagePath: '/gstatic/loyalty-program/',
    imageType: 'png',
    decorLeftPath: '/gstatic/loyalty-program/decor/left-decor.png',
    decorRightPath: '/gstatic/loyalty-program/decor/right-decor.png',
    levelsLimit: 4,
    /**
     * this text will be shown on empty state(when there is no content)
     */
    emptyStateText: gettext('An error occurred while loading data. Please try again later.'),
    sliderParams: sliderDefaultParams,
};
