import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IRealityCheckInfoCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    FromTime?: string;
    Deposits?: number;
    Losses?: number;
    Wins?: number;
}

export const defaultParams: IRealityCheckInfoCParams = {
    class: 'wlc-reality-check-info',
};
