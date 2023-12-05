import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IAutoLogoutProfileBlockCParams extends
    IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    description?: string;
    buttonText?: string;
};

export const defaultParams: IAutoLogoutProfileBlockCParams = {
    class: 'wlc-auto-logout-profile-block',
    componentName: 'wlc-auto-logout-profile-block',
    moduleName: 'user',
    description: gettext('You can set the time of automatic logout if you were inactive on the site'),
    buttonText: gettext('Change'),
};
