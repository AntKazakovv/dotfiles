import {
    CustomType,
    IComponentParams,
    ISliderCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentType = 'default' | CustomType;
export type TSliderDefaultParams = {[key in ComponentTheme]?: ISliderCParams};

export interface ILoyaltyProgramCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    title?: string;
    decorLeftPath?: string;
    decorRightPath?: string;
    decorImageType?: string;
    /**
     * crop levels to this value. Not working for wolf theme.
     */
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

export const sliderDefaultParams: TSliderDefaultParams = {
    'default': {
        swiper: {
            slidesPerView: 'auto',
            spaceBetween: 10,
            allowSlideNext: true,
            followFinger: true,
            slidesOffsetBefore: 80,
            slidesOffsetAfter: 80,
            breakpoints: {
                375: {
                    followFinger: true,
                },
                768: {
                    spaceBetween: 10,
                },
                1024: {
                    spaceBetween: 20,
                },
            },
        },
    },
    'wolf': {
        swiper: {
            allowSlideNext: true,
            followFinger: true,
            slidesPerView: 'auto',
            spaceBetween: 8,
            navigation: {
                enabled: true,
                nextEl: '.wlc-swiper-button-next',
                prevEl: '.wlc-swiper-button-prev',
            },
            breakpoints: {
                900: {
                    spaceBetween: 12,
                    slidesPerView: 5,
                    navigation: {
                        enabled: true,
                    },
                },
            },
        },
    },
};

export const defaultParams: ILoyaltyProgramCParams = {
    moduleName: 'loyalty',
    componentName: 'wlc-loyalty-program',
    class: 'wlc-loyalty-program',
    decorLeftPath: '/gstatic/loyalty-program/decor/left-decor.png',
    decorRightPath: '/gstatic/loyalty-program/decor/right-decor.png',
    levelsLimit: 4,
    emptyStateText: gettext('An error has occurred while loading data. Please try again later.'),
};
