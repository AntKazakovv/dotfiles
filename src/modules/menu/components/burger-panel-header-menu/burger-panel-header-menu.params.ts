import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {BurgerPanelType} from 'wlc-engine/modules/core/components/burger-panel/burger-panel.params';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IBurgerPanelHeaderMenuCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    theme?: Theme;
    themeMod?: ThemeMod;
    common?: {
        panelType: BurgerPanelType,
    };
    type?: Type,
}

export const defaultParams: IBurgerPanelHeaderMenuCParams = {
    moduleName: 'menu',
    componentName: 'wlc-burger-panel-header-menu',
    class: 'wlc-burger-panel-header-menu',
    common: {
        panelType: 'left',
    },
};
