import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {TFixedPanelPos} from 'wlc-engine/modules/core/system/interfaces/base-config/fixed-panel.interface';
import {
    MenuParams,
} from 'wlc-engine/modules/menu';

export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'fixed-burger' | 'wolf' | CustomType;
export type ComponentType = 'default' | 'burger-menu' | CustomType;
export type AutoModifiers = ComponentTheme | ComponentThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IMainMenuCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        useSwiperNavigation?: boolean;
        useSwiper?: boolean;
        themeMod?: ComponentThemeMod;
        icons?: {
            folder?: string,
            use?: boolean,
        }
    };
    items?: MenuParams.IMenuItem[];
    menuParams?: MenuParams.IMenuCParams,
    fixedPanelPosition?: TFixedPanelPos,
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
    fixedPanelPosition: 'left',
};
