import {
    CustomType,
    IButtonCParams,
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
    btnParams?: IButtonCParams;
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
            spaceBetween: 12,
            slidesPerView: 'auto',
            breakpoints: {
                900: {
                    spaceBetween: 20,
                    slidesPerView: 5,
                },
            },
        },
    },
};

export const defaultParams: ILoyaltyProgramCParams = {
    moduleName: 'loyalty',
    componentName: 'wlc-loyalty-program',
    class: 'wlc-loyalty-program',
    decorLeftPath: '//agstatic.com/loyalty-program/decor/left-decor.png',
    decorRightPath: '//agstatic.com/loyalty-program/decor/right-decor.png',
    levelsLimit: 4,
    emptyStateText: gettext('An error has occurred while loading data. Please try again later.'),
    btnParams: {
        common: {
            text: gettext('Read more'),
            typeAttr: 'button',
        },
        themeMod: 'secondary',
        wlcElement: 'button_loyalty-program',
    },
};
