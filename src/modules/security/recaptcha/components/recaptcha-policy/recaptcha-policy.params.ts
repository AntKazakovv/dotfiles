import {IComponentParams} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default';
export type ComponentType = 'default';
export interface IRecaptchaPolicyCParams extends IComponentParams<ComponentTheme, ComponentType, string> {}

export const defaultParams: IRecaptchaPolicyCParams = {
    class: 'wlc-recaptcha-policy',
    moduleName: 'recaptcha',
    componentName: 'wlc-recaptcha-policy',
};
