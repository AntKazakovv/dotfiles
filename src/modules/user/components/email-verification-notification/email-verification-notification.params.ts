import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IEmailVerificationNotificationCParams extends
    IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
        useButtonGoToMail?: boolean;
    };

export const defaultParams: IEmailVerificationNotificationCParams = {
    moduleName: 'user',
    componentName: 'wlc-email-verification-notification',
    class: 'wlc-email-verification-notification',
    useButtonGoToMail: false,
};
