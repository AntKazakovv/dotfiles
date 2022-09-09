import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {ISliderCParams} from 'wlc-engine/modules/promo';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ILootboxModalCParams extends IComponentParams<Theme, Type, ThemeMod> {
    /** Object "Bonus" */
    bonus: Bonus;
    /** Total number of slides */
    totalSlides: number;
    /** Object with params for slider */
    sliderParams: ISliderCParams;
}

export const defaultParams: Partial<ILootboxModalCParams> = {
    moduleName: 'bonuses',
    componentName: 'wlc-lootbox-modal',
    class: 'wlc-lootbox-modal',
    totalSlides: 29,
    sliderParams: {
        swiper: {
            slidesPerView: 'auto',
            initialSlide: 2,
            spaceBetween: 10,
            speed: 3500,
            centeredSlides: true,
            centeredSlidesBounds: true,
            enabled: false,
        },
    },
};
