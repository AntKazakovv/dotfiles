import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export type Type = CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IMobileMenuCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        useArrow?: boolean;
        icons?: {
            folder?: string,
            use?: boolean,
        },
    };
    kioskItems?: MenuParams.MenuConfigItem[];
};

export const defaultParams: IMobileMenuCParams = {
    moduleName: 'menu',
    componentName: 'wlc-mobile-menu',
    class: 'wlc-mobile-menu',
    kioskItems: [
        'mobile-menu:categories',
    ],
};
