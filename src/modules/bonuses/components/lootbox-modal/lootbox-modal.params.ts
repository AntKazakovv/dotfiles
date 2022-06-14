import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus';
import {ISliderCParams} from 'wlc-engine/modules/promo';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ILootboxModalCParams extends IComponentParams<Theme, Type, ThemeMod> {
    /** Object "Bonus" */
    bonus: Bonus;
    /** Total number of slides */
    totalSlides: number;
    /** The number of slides that will be rendered immediately when the modal window is opened */
    initialSlides: number;
    /** Object with params for slider */
    sliderParams: ISliderCParams;
}

export const defaultParams: Partial<ILootboxModalCParams> = {
    moduleName: 'bonuses',
    componentName: 'wlc-lootbox-modal',
    class: 'wlc-lootbox-modal',
    totalSlides: 29,
    initialSlides: 5,
    sliderParams: {
        swiper: {
            slidesPerView: 3,
            initialSlide: 2,
            spaceBetween: 10,
            speed: 3500,
            centeredSlides: true,
            centeredSlidesBounds: true,
            enabled: false,
        },
    },
};
