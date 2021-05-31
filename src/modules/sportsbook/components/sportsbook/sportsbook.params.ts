import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ISportsbookCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    theme?: Theme;
    themeMod?: ThemeMod;
    common?: {
        sportsbookId?: string,
    };
    type?: Type,
}

export const defaultParams: ISportsbookCParams = {
    moduleName: 'sportsbook',
    componentName: 'wlc-csportsbook',
    class: 'wlc-sportsbook',
};
