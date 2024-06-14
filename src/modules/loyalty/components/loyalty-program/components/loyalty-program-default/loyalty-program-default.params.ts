import {
    IComponentParams,
    CustomType,
    ISliderCParams,
    IButtonCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILoyaltyProgramDefaultCParams
    extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    sliderParams?: ISliderCParams;
    btnParams?: IButtonCParams;
    useNavigation?: boolean;
}

export const defaultParams: ILoyaltyProgramDefaultCParams = {
    moduleName: 'loyalty',
    class: 'wlc-loyalty-program-default',
    componentName: 'wlc-loyalty-program-default',
    theme: 'default',
    useNavigation: false,
    sliderParams: {
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
    btnParams: {
        common: {
            text: gettext('Read more'),
            typeAttr: 'button',
        },
        themeMod: 'secondary',
        wlcElement: 'button_loyalty-program',
    },
};
