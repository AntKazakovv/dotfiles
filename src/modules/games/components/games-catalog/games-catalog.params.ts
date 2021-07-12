import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {
    IGamesGridCParams,
} from 'wlc-engine/modules/games';
import {
    ISliderCParams,
} from 'wlc-engine/modules/promo';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IGamesCatalogCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    gamesGridParams?: IGamesGridCParams,
    /**
     * Slider params if use showAsSwiper
     */
    sliderParams?: ISliderCParams,
}

export const sliderParams: ISliderCParams = {
    swiper: {
        watchOverflow: true,
        slidesPerColumnFill: 'row',
        slidesPerView: 6,
        slidesPerColumn: 2,
        spaceBetween: 20,
        pagination: false,
        breakpoints: {
            200: {
                slidesPerView: 1,
                spaceBetween: 10,
                slidesPerColumn: 2,
            },
            375: {
                slidesPerView: 2,
                spaceBetween: 10,
                slidesPerColumn: 2,
            },
            560: {
                slidesPerView: 3,
                spaceBetween: 10,
                slidesPerColumn: 2,
            },
            720: {
                slidesPerView: 4,
                spaceBetween: 10,
                slidesPerColumn: 2,
            },
            900: {
                slidesPerView: 3,
                spaceBetween: 10,
                slidesPerColumn: 2,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 15,
                slidesPerColumn: 2,
            },
            1200: {
                slidesPerView: 5,
                spaceBetween: 15,
                slidesPerColumn: 2,
            },
            1630: {
                slidesPerView: 6,
                spaceBetween: 20,
                slidesPerColumn: 2,
            },
        },
    },
};

export const defaultParams: IGamesCatalogCParams = {
    moduleName: 'games',
    componentName: 'wlc-games-catalog',
    class: 'wlc-games-catalog',
    gamesGridParams: {
        gamesRows: 2,
        byState: true,
    },
};
