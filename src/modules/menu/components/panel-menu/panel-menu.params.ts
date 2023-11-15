import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {IMenuCParams} from 'wlc-engine/modules/menu/components/menu/menu.params';

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
    menuParams?: IMenuCParams;
};

export const defaultParams: IPanelMenuCParams = {
    moduleName: 'menu',
    componentName: 'wlc-panel-menu',
    class: 'wlc-panel-menu',
    menuParams: {
        type: 'panel-menu',
        dropdowns: {
            expandableOnClick: true,
        },
        tooltip: {
            containerClass: 'wlc-tooltip-wolf',
        },
    },
};
