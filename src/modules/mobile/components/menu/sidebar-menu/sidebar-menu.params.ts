import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {
    MenuParams,
} from 'wlc-engine/modules/menu';

export type Type = 'default'  | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ISidebarMenuCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        icons?: {
            folder?: string,
            use?: boolean,
        }
    };
    menuParams?: MenuParams.IMenuCParams,
}

export const defaultParams: ISidebarMenuCParams = {
    moduleName: 'menu',
    componentName: 'wlc-sidebar-menu',
    class: 'wlc-sidebar-menu',
    wlcElement: 'wlc-sidebar-menu',
    menuParams: {
        theme: 'mobile-app-main',
        common: {
            useSwiper: false,
            icons: {
                fallback: 'wlc/icons/asian/v1/plug.svg',
                arrows: {
                    use: true,
                },
            },
        },
    },
};
