import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ITitle {
    text: string;
    icon: string;
}

export interface IPwaNotificationCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    title: ITitle;
    // exclude states - notification will not shown
    excludeStates?: string[];
}

export const defaultParams: IPwaNotificationCParams = {
    class: 'wlc-pwa-notification',
    moduleName: 'pwa',
    componentName: 'wlc-pwa-notification',
    title: {
        text: gettext('Install application'),
        icon: '/wlc/icons/install.svg',
    },
    excludeStates: ['app.instructions'],
};
