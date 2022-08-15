import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {TIconExtension} from 'wlc-engine/modules/menu';
import {
    MenuParams,
} from 'wlc-engine/modules/menu';

export type Type = CustomType;
export type Theme = 'default' | 'circled' | 'static-circle' | CustomType;
export type ThemeMod = 'default'| CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IStickyFooterCParams extends IComponentParams<Theme, Type, ThemeMod> {
    common?: {
        useSwiper?: boolean;
        themeMod?: ThemeMod;
        icons?: {
            folder?: string;
            use?: boolean,
            extension?: TIconExtension;
        }
    };
    items?: MenuParams.IMenuItem[];
    menuParams?: MenuParams.IMenuCParams,
}

export const defaultParams: IStickyFooterCParams = {
    moduleName: 'menu',
    componentName: 'wlc-sticky-footer',
    class: 'wlc-sticky-footer',
    menuParams: {
        type: 'sticky-footer',
        items: [],
        common: {
            useSwiper: false,
        },
    },
};
