import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IEndedSessionModalParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    modalTitle?: string
    modalMessage?: string
    iconPath?: string
}

export const defaultParams: IEndedSessionModalParams = {
    moduleName: 'user',
    componentName: 'wlc-ended-session-modal',
    class: 'wlc-ended-session-modal',
    modalTitle: gettext('The session has ended'),
    modalMessage: gettext('The game session has expired or you have logged in from another device'),
    iconPath: '/wlc/icons/status/alert.svg',
};
