import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes';

export interface IProfileMenuItemsGroup<T> {
    parent: T;
    items: T[];
}
export interface IProfileMenuFilter {
    config: string;
    item: string;
}

export type Type = 'tabs' | 'submenu' | 'dropdown' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IProfileMenuCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        useArrow?: boolean;
    };
}

export const defaultParams: IProfileMenuCParams = {
    moduleName: 'menu',
    componentName: 'wlc-profile-menu',
    class: 'wlc-profile-menu',
    type: 'tabs',
};
