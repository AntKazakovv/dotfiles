import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {TIconExtension} from 'wlc-engine/modules/menu';
import {CategoryMenuComponent} from 'wlc-engine/modules/menu/components/category-menu/category-menu.component';
import {initAsDropdownDefault} from 'wlc-engine/modules/menu/components/category-menu/customizable/init-as-dropdown';
import {
    addAdditionalButtonsDefault,
} from 'wlc-engine/modules/menu/components/category-menu/customizable/add-additinal-buttons';

import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export type TCustomizableFn = (this: CategoryMenuComponent) => void;

export interface ICustomizableFn {
    initAsDropdown?: TCustomizableFn;
    addAdditionalButtons?: TCustomizableFn;
}

export type Type = 'default' | 'dropdown' | CustomType;
export type Theme = 'default' | 'dropdown' | 'with-icons' | 'icons-compact' | 'mobile-app' | CustomType;
export type ThemeMod = 'default' | 'vertical' | 'underlined' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ICategoryMenuCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    theme?: Theme;
    themeMod?: ThemeMod;
    common?: {
        useSliderNavigation?: boolean;
        icons?: {
            folder?: string;
            use?: boolean,
            extension?: TIconExtension;
        }
    };
    type?: Type,
    menuParams?: MenuParams.IMenuCParams,
    customizableFn?: ICustomizableFn;
}

export const defaultParams: ICategoryMenuCParams = {
    moduleName: 'menu',
    componentName: 'wlc-category-menu',
    class: 'wlc-category-menu',
    common: {
        useSliderNavigation: false,
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
    customizableFn: {
        initAsDropdown: initAsDropdownDefault,
        addAdditionalButtons: addAdditionalButtonsDefault,
    },
};
