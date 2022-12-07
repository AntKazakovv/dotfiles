import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {ISliderCParams} from 'wlc-engine/modules/promo';
import {IGamesGridCParams} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';

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
        grid: {
            rows: 2,
            fill: 'row',
        },
        slidesPerView: 6,
        spaceBetween: 20,
        pagination: false,
        breakpoints: {
            200: {
                slidesPerView: 1,
                spaceBetween: 10,
                followFinger: false,
            },
            375: {
                slidesPerView: 2,
                spaceBetween: 10,
                followFinger: false,
            },
            560: {
                slidesPerView: 3,
                spaceBetween: 10,
                followFinger: false,
            },
            720: {
                slidesPerView: 4,
                spaceBetween: 10,
                followFinger: false,
            },
            900: {
                slidesPerView: 3,
                spaceBetween: 10,
                followFinger: false,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 15,
                followFinger: true,
            },
            1200: {
                slidesPerView: 5,
                spaceBetween: 15,
            },
            1630: {
                slidesPerView: 6,
                spaceBetween: 20,
            },
        },
    },
};

export const defaultParams: IGamesCatalogCParams = {
    moduleName: 'games',
    componentName: 'wlc-games-catalog',
    class: 'wlc-games-catalog',
    gamesGridParams: {
        gamesRows: 3,
        byState: true,
    },
};
