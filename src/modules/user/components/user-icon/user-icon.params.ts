import {
    IComponentParams,
    CustomType,
    IButtonCParams,
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
    /**
     * userIcon use as button
     */
    showAsBtn?: boolean;
    /**
     * Params for button (if userIcon use showAsBtn = true)
     */
    buttonParams?: IButtonCParams;
    useDefaultAvatar?: boolean;
    showSvgAsImg?: boolean;
};

export const defaultParams: IUserIconCParams = {
    class: 'wlc-user-icon',
    componentName: 'wlc-user-icon',
    moduleName: 'user',
    iconPath: '/wlc/icons/user-icon.svg',
    theme: 'default',
};

export const defaultButtonParams: IButtonCParams = {
    theme: 'cleared',
    themeMod: 'secondary',
    customMod: 'user',
};
