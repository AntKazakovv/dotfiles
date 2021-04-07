import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export type Type = 'default' | 'dropdown' | CustomType;
export type Theme = 'default' | 'dropdown' | CustomType;
export type ThemeMod = 'default' | 'vertical' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ICategoryMenuCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    theme?: Theme;
    themeMod?: ThemeMod;
    common?: {
        icons?: {
            folder?: string;
            use?: boolean,
        }
    };
    type?: Type,
    menuParams?: MenuParams.IMenuCParams,
}

export const defaultParams: ICategoryMenuCParams = {
    moduleName: 'menu',
    componentName: 'wlc-category-menu',
    class: 'wlc-category-menu',
    menuParams: {
        type: 'category-menu',
        items: [],
        common: {
            useSwiper: true,
            swiper: {
                scrollToStart: true,
            },
            icons: {
                fallback: '',
            },
        },
    },
};
