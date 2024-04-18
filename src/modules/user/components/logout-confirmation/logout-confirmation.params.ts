import {
    IComponentParams,
    CustomType,
    IWrapperCParams,
    IModalConfig,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IConfirmationCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    iconConfig: IWrapperCParams;
    config: IModalConfig;
};

export const defaultParams: IConfirmationCParams = {
    class: 'wlc-logout-confirmation',
    componentName: 'wlc-logout-confirmation',
    moduleName: 'user',
    iconConfig: {
        components: [
            {
                name: 'core.wlc-icon',
                params: {
                    iconPath: '/wlc/icons/status/confirm.svg',
                },
            },
        ],
    },
    config: {
        id: 'logout',
        modalMessage: [gettext('Are you sure?')],
        wlcElement: 'modal_logout',
        showConfirmBtn: true,
        closeBtnParams: {
            type: 'rejected',
            themeMod: 'secondary',
            wlcElement: 'button_close',
            common: {
                text: gettext('No'),
            },
        },
        confirmBtnParams: {
            wlcElement: 'button_yes',
            common: {
                text: gettext('Yes'),
            },
        },
        textAlign: 'center',
    },
};
