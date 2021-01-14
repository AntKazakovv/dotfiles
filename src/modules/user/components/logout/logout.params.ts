import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ILogoutCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    useText?: boolean;
}

export const defaultParams: ILogoutCParams = {
    class: 'wlc-logout',
};
