import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IDeadsimplechatCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    theme?: Theme;
    themeMod?: ThemeMod;
    common?: {
        roomId?: string,
        iconPath?: string,
        buttonText?: string,
    };
    type?: Type,
}

export const defaultParams: IDeadsimplechatCParams = {
    moduleName: 'deadsimplechat',
    componentName: 'wlc-deadsimplechat',
    class: 'wlc-deadsimplechat',
};
