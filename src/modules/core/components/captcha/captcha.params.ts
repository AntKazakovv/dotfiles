import {IButtonCParams} from 'wlc-engine/modules/core/components/button/button.component';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/interfaces/config.interface';

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
    moduleName: 'core',
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
