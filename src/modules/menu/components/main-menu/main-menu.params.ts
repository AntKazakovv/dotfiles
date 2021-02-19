import {IMenuItem} from 'wlc-engine/modules/menu/components/menu/menu.params';
import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IMainMenuCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        icons?: {
            folder?: string,
            use?: boolean,
        }
    };
    items?: IMenuItem[];
}

export const defaultParams: IMainMenuCParams = {
    moduleName: 'menu',
    componentName: 'wlc-main-menu',
    class: 'wlc-main-menu',
};
