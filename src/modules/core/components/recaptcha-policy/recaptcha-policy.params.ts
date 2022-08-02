import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default';
export type ComponentType = 'default';
export interface IRecaptchaPolicyCParams extends IComponentParams<ComponentTheme, ComponentType, string> {}

export const defaultParams: IRecaptchaPolicyCParams = {
    class: 'wlc-recaptcha-policy',
    moduleName: 'core',
    componentName: 'wlc-recaptcha-policy',
};
