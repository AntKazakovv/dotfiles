import {
    IComponentParams,
    CustomType,
    IPagination,
} from 'wlc-engine/modules/core';

export type Type = 'default' | CustomType;
export type Theme = 'default' | 'first' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IStoreListCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        customModifiers?: CustomMod;
        byCategories?: boolean;
        pagination?: IPagination;
    };
}

export const defaultParams: IStoreListCParams = {
    moduleName: 'store',
    componentName: 'wlc-store-list',
    class: 'wlc-store-list',
};
