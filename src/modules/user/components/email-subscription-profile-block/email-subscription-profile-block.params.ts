import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IEmailSubscriptionProfileBlockCParams extends
    IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
};

export const defaultParams: IEmailSubscriptionProfileBlockCParams = {
    class: 'wlc-email-subscription-profile-block',
    componentName: 'wlc-email-subscription-profile-block',
    moduleName: 'user',
};
