import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {limitTypeTexts} from 'wlc-engine/modules/user/submodules/limitations/system/config/limitations.config';
import {TLimitationType} from 'wlc-engine/modules/user/submodules/limitations/system/interfaces';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export const limitCancelTypes = Object.keys(limitTypeTexts);

export interface ILimitCancelCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    value?: TLimitationType | 'CoolOffTime' | string;
}

export const defaultParams: ILimitCancelCParams = {
    moduleName: 'limitations',
    componentName: 'wlc-limit-cancel',
    class: 'wlc-limit-cancel',
};
