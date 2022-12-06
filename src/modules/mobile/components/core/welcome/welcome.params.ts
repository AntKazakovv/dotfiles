import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type Type = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IWelcomeCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    /** title on the top of component */
    title: string;
    /** short description under title */
    description: string;
    /** text for sigin in button */
    siginIn: string;
    /** text for sigin up button */
    siginUp: string;
}

export const defaultParams: IWelcomeCParams = {
    moduleName: 'mobile',
    componentName: 'wlc-welcome',
    class: 'wlc-welcome',
    title: gettext('Welcome!'),
    description: gettext('Log in to your account or create a new one'),
    siginIn: gettext('Sign in'),
    siginUp: gettext('Create account'),
};
