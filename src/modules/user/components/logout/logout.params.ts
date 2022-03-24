import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ILogoutCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    /**
     * if true, the text "Sign out" will be in front of the logout icon
     */
    useText?: boolean;
    /**
     * set the text to be displayed in the logout modal
     */
    textMessage?: string;
}

export const defaultParams: ILogoutCParams = {
    moduleName: 'user',
    componentName: 'wlc-logout',
    class: 'wlc-logout',
    textMessage: gettext('Are you sure?'),
};
