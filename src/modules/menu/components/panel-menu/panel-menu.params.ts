import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type Type = 'info' | CustomType;
export type Theme = 'default' | 'wolf' | CustomType;
export type ThemeMod = 'default' | 'wolf' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IPanelMenuCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    themeMod?: ThemeMod;
    icons?: {
        folder?: string;
        use?: boolean;
    },
};

export const defaultParams: IPanelMenuCParams = {
    moduleName: 'menu',
    componentName: 'wlc-panel-menu',
    class: 'wlc-panel-menu',
};
