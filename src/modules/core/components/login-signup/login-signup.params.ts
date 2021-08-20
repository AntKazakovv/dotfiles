import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentType = 'default' | CustomType;
export type ThemeType = 'default' | CustomType;
export type ThemeModType = 'default' | CustomType;

export type IActionNameType = 'login' | 'signup' | 'changePassword';
export type IActionType = 'login' | 'signup' | 'changePassword' | 'url' | 'modal';
export type ITargetType = 'blank' | 'self';
export type IButtonCParams = {
    action?: IActionType;
    title?: string;
    url?: string;
    target?: ITargetType;
};

export interface ILoginSignupCParams extends IComponentParams<ThemeType, ComponentType, ThemeModType> {
    login?: IButtonCParams;
    signup?: IButtonCParams;
    changePassword?: IButtonCParams;
}

export const defaultParams: ILoginSignupCParams = {
    class: 'wlc-login-signup',
    moduleName: 'user',
    componentName: 'wlc-login-signup',
    changePassword: {
        action: 'changePassword',
    },
};
