import {IComponentParams, CustomType} from 'wlc-engine/classes/abstract.component';

export type Type = 'default' | 'resolved' | 'rejected' | 'pending' | 'disabled' | CustomType;
export type Theme = 'default' | 'skew' | 'rounding' | 'circled' | CustomType;
export type Size = 'default' | 'small' | 'big' | CustomType;
export type ThemeMod = 'default' | 'secondary' | CustomType;
export type Index = number | string | null;
export type AutoModifiers = Theme | Size | ThemeMod | 'loading';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IButtonParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        size?: Size;
        icon?: string;
        index?: Index;
        text?: string;
        customModifiers?: CustomMod;
        event?: {
          name: string;
          data?: unknown;
        };
    };
}

export const defaultParams: IButtonParams = {
    moduleName: 'core',
    componentName: 'wlc-button',
    class: 'wlc-btn',
    common: {
        size: 'default',
    },
};
