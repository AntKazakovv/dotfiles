import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {
    MenuParams,
} from 'wlc-engine/modules/menu';

export type Type = 'default' | 'burger-menu' | 'fixed-burger' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | 'fixed-burger' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IMainMenuCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        useSwiper?: boolean;
        themeMod?: ThemeMod;
        icons?: {
            folder?: string,
            use?: boolean,
        }
    };
    items?: MenuParams.IMenuItem[];
    menuParams?: MenuParams.IMenuCParams,
}

export const defaultParams: IMainMenuCParams = {
    moduleName: 'menu',
    componentName: 'wlc-main-menu',
    class: 'wlc-main-menu',
    menuParams: {
        type: 'main-menu',
        items: [],
        common: {
            useSwiper: false,
            icons: {
                fallback: 'wlc/icons/asian/v1/plug.svg',
            },
        },
    },
};
