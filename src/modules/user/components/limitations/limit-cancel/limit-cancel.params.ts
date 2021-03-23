import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {limitTypeTexts} from '../limitations.shared';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export const limitCancelTypes = Object.keys(limitTypeTexts);

export interface ILimitCancelCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    value?: string;
}

export const defaultParams: ILimitCancelCParams = {
    class: 'wlc-limit-cancel',
};
