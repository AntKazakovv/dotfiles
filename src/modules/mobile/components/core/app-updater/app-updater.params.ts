import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type Type = CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IAppUpdaterParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
}

export const defaultParams: IAppUpdaterParams = {
    moduleName: 'mobile',
    componentName: 'wlc-app-updater',
    class: 'wlc-app-updater',
};
