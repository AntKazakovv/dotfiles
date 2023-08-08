import {
    IComponentParams,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import * as componentLib from 'wlc-engine/modules/core/system/config/layouts/components';

export type ModeType = 'default';
export type ComponentTheme = 'universal';
export type ThemeMode = 'with-balance-info' | 'toggler';
export type ComponentType = 'default';
export type AutoModifiersType = ComponentTheme | ModeType;
export type ManualModifiersType = '';
export type ModifiersType = AutoModifiersType & ManualModifiersType & string;

export interface IHeaderConfig {
    base?: IWrapperCParams;
    left?: IWrapperCParams;
    right?: IWrapperCParams;
}

export interface IHeaderCParams extends IComponentParams<ComponentTheme, ComponentType, ThemeMode> {
    config?: IHeaderConfig;
    container?: boolean;
}

export const defaultParams: IHeaderCParams = {
    class: 'wlc-header',
    moduleName: 'core',
    componentName: 'wlc-header',
    theme: 'universal',
    container: true,
    config: {
        left: {
            components: [
                componentLib.wlcButton.burger,
                componentLib.wlcLogo.header,
            ],
        },
        base: {
            components: [
                componentLib.wlcMainMenu.header,
            ],
        },
        right: {
            components: [
                componentLib.wlcLoginSignup.header,
                componentLib.wlcUserInfo.header,
                componentLib.wlcButton.userDepositIcon,
                componentLib.wlcButton.searchV2,
                componentLib.wlcButton.signup,
            ],
        },
    },
};
