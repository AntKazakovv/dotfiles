import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ILimitValueCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    value?: string;
    valueType?: string;
}

export const defaultParams: ILimitValueCParams = {
    class: 'wlc-limit-value',
};
