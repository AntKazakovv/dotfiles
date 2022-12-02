import {
    IComponentParams,
    CustomType,
    IButtonCParams,
} from 'wlc-engine/modules/core';

export type Theme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;

export interface IRefreshButton {
    isShown?: boolean,
    params: IButtonCParams,
}
export interface ICaptchaCParams extends IComponentParams<Theme, ComponentType, ComponentType> {
    refreshButton?: IRefreshButton,
}

export const defaultParams: ICaptchaCParams = {
    moduleName: 'captcha',
    componentName: 'wlc-captcha',
    class: 'wlc-captcha',
    refreshButton: {
        isShown: false,
        params: {
            theme: 'cleared',
            common: {
                iconPath: '/wlc/icons/loader.svg',
            },
        },
    },
};
