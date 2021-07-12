import {RawParams} from '@uirouter/core';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type Type = 'default' | 'resolved' | 'rejected' | 'pending' | 'disabled' | CustomType;
export type Theme = 'default' | 'skew' | 'rounding' | 'circled' | 'borderless' | 'icon' | 'cleared' | CustomType;
export type Size = 'default' | 'small' | 'big' | CustomType;
export type ThemeMod = 'default' | 'secondary' | 'readmore' | CustomType;
export type Index = number | string | null;
export type AutoModifiers = Theme | Size | ThemeMod | 'loading';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;
export type EventType = {
    name: string;
    data?: unknown;
}

export interface IButtonCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        size?: Size;
        icon?: string;
        index?: Index;
        text?: string;
        customModifiers?: CustomMod;
        event?: EventType | EventType[];
        sref?: string;
        srefParams?: RawParams;
        typeAttr?: string;
        wlcElement?: string;
    };
}

export const defaultParams: IButtonCParams = {
    moduleName: 'core',
    componentName: 'wlc-button',
    class: 'wlc-btn',
    common: {
        size: 'default',
    },
};
