import {
    IComponentParams,
    CustomType,
    ISliderCParams,
    IButtonCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'wolf' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILoyaltyProgramWolfCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    sliderParams?: ISliderCParams;
    useNavigation?: boolean;
    btnParams?: IButtonCParams;
}

export const defaultParams: ILoyaltyProgramWolfCParams = {
    moduleName: 'loyalty',
    class: 'wlc-loyalty-program-wolf',
    componentName: 'wlc-loyalty-program-wolf',
    theme: 'wolf',
    useNavigation: true,
    sliderParams: {
        swiper: {
            allowSlideNext: true,
            followFinger: true,
            slidesPerView: 'auto',
            breakpoints: {
                900: {
                    spaceBetween: 20,
                    slidesPerView: 5,
                },
            },
        },
    },
    btnParams: {
        common: {
            text: gettext('All'),
            typeAttr: 'button',
        },
        theme: 'wolf-rounded',
        wlcElement: 'button_loyalty-program',
    },
};
