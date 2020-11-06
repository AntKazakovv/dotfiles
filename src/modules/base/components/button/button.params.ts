import {IComponentParams, Custom} from 'wlc-engine/classes/abstract.component';

export type Type = 'default' | 'resolved' | 'rejected' | 'pending' | 'disabled' | Custom;
export type Theme = 'default' | 'skew' | 'rounding' | 'circled' | Custom;
export type Size = 'default' | 'small' | 'big' | Custom;
export type ThemeMod = 'default' | 'secondary' | Custom;
export type Index = number | string | null;
export type AutoModifiers = Theme | Size | ThemeMod | 'loading';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IBParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        size?: Size;
        icon?: string;
        index?: Index;
        text?: string;
        customModifiers?: CustomMod;
    };
}

export const defaultParams: IBParams = {
    moduleName: 'base',
    componentName: 'wlc-button',
    class: 'wlc-btn',
    common: {
        size: 'default',
    },
};
