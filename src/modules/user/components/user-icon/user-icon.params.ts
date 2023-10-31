import {
    IComponentParams,
    CustomType,
    TButtonAnimation,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'avatar' | 'wolf' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;
export type EventType = {
    name: string;
    data?: string;
}
export const defaultAvatar: string = '/wlc/icons/icon_default-avatar.svg';

export interface IUserIconCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    event?: EventType;
    iconPath?: string,
    showAsBtn?: boolean;
    useDefaultAvatar?: boolean;
    animation?: TButtonAnimation;
};

export const defaultParams: IUserIconCParams = {
    class: 'wlc-user-icon',
    componentName: 'wlc-user-icon',
    moduleName: 'user',
    iconPath: '/wlc/icons/user-icon.svg',
};
