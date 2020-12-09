import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Type = 'default' | 'dropdown' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ICategoryMenuCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
    };
}

export const defaultParams: ICategoryMenuCParams = {
    moduleName: 'menu',
    componentName: 'wlc-category-menu',
    class: 'wlc-category-menu',
};
