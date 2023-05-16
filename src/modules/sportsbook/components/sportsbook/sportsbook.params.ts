import {
    IComponentParams,
    CustomType,
    ILoaderCParams,
} from 'wlc-engine/modules/core';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IOwnLoader {
    use?: boolean,
    loaderParams?: ILoaderCParams,
}

export interface ISportsbookCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    theme?: Theme;
    themeMod?: ThemeMod;
    common?: {
        sportsbookId?: string,
    };
    type?: Type,
    ownLoader?: IOwnLoader,
}

export const defaultParams: ISportsbookCParams = {
    moduleName: 'sportsbook',
    componentName: 'wlc-csportsbook',
    class: 'wlc-sportsbook',
};
