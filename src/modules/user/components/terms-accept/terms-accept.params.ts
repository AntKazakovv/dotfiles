import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ITermsAcceptCParams extends IComponentParams<ComponentTheme, ComponentType, string> {}

export const defaultParams: ITermsAcceptCParams = {
    class: 'wlc-accept-terms',
    moduleName: 'user',
    componentName: 'wlc-accept-terms',
};
