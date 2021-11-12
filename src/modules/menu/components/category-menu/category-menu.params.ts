import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {TIconExtension} from 'wlc-engine/modules/menu';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export type Type = 'default' | 'dropdown' | CustomType;
export type Theme = 'default' | 'dropdown' | 'with-icons' | 'icons-compact' | CustomType;
export type ThemeMod = 'default' | 'vertical' | 'underlined' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ICategoryMenuCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    theme?: Theme;
    themeMod?: ThemeMod;
    common?: {
        useSwiperNavigation?: boolean;
        icons?: {
            folder?: string;
            use?: boolean,
            extension?: TIconExtension;
        }
    };
    type?: Type,
    menuParams?: MenuParams.IMenuCParams,
}

export const defaultParams: ICategoryMenuCParams = {
    moduleName: 'menu',
    componentName: 'wlc-category-menu',
    class: 'wlc-category-menu',
    common: {
        useSwiperNavigation: false,
    },
    menuParams: {
        type: 'category-menu',
        items: [],
        sliderParams: {
            swiper: {
                spaceBetween: 0,
            },
        },
        common: {
            useSwiper: true,
            swiper: {
                scrollToStart: true,
            },
            icons: {
                fallback: '',
            },
        },
        dropdowns: {
            expandableOnClick: true,
        },
    },
};
