import {SwiperOptions} from 'swiper';
import {IComponentParams} from 'wlc-engine/modules/core';

export type ModifiersType = string;
export type Theme = 'default' | 'footer';
export type ThemeMod = 'default' | 'footer-info' | 'footer-about';
export type Type = 'default';

export interface IBasePath {
    url: string;
    addLanguage?: boolean;
    page?: string;
}

export interface IPostMenuCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: ModifiersType[];
    common?: {
        categorySlug?: string | string[];
        /** excluded slugs from categories */
        exclude?: string[];
        groupBySlag?: boolean;
        title?: string | string[];
        basePath?: IBasePath;
        useSlider?: boolean;
    };
    asListBp: string;
    swiperParams: SwiperOptions;
}

export const defaultParams: IPostMenuCParams = {
    class: 'wlc-post-menu',
    common: {
        useSlider: false,
        groupBySlag: false,
    },
    asListBp: '(max-width: 1023px)',
    swiperParams: {
        direction: 'horizontal',
        slidesPerView: 'auto',
        spaceBetween: 20,
        breakpoints: {
            1630: {
                spaceBetween: 60,
            },
        },
    },
};
