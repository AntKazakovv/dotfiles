import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentType = 'default' | CustomType;
export type ThemeType = 'default' | CustomType;
export type ThemeModType = 'default' | CustomType;

export type IActionNameType = 'login' | 'signup' | 'changePassword';
export type IActionType = 'login' | 'signup' | 'changePassword' | 'url' | 'modal';
export type ITargetType = 'blank' | 'self';
export type IButtonParams = {
    action?: IActionType;
    title?: string;
    url?: string;
    target?: ITargetType;
};

export interface ILoginSignupCParams extends IComponentParams<ThemeType, ComponentType, ThemeModType> {
    login?: IButtonParams;
    signup?: IButtonParams;
    changePassword?: IButtonParams;
}

export const defaultParams: ILoginSignupCParams = {
    class: 'wlc-login-signup',
    changePassword: {
        action: 'changePassword',
    },
};
