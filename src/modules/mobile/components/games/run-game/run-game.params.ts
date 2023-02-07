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

export interface IButtonsText {
    signIn?: string;
    playReal?: string;
    playDemo?: string;
}

export interface IRunGameCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    buttonsText?: IButtonsText;
}

export const defaultParams:  IRunGameCParams = {
    moduleName: 'mobile',
    componentName: 'wlc-run-game',
    class: 'wlc-run-game',
    buttonsText: {
        signIn: gettext('Sign in'),
        playReal: gettext('Play'),
        playDemo: gettext('Demo'),
    },
};
