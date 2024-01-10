import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface INotificationSettingsCParams extends
    IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
};

export const defaultParams: INotificationSettingsCParams = {
    class: 'wlc-notification-settings',
    componentName: 'wlc-notification-settings',
    moduleName: 'user',
};
