import {
    IComponentParams,
    CustomType,
    IButtonCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface INicknameIconCParams extends
    IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
        btnParams?: IButtonCParams,
        showSvgAsImg?: boolean,
};

export const defaultParams: INicknameIconCParams = {
    class: 'wlc-nickname-icon',
    componentName: 'wlc-nickname-icon',
    moduleName: 'user',
    btnParams: {
        common: {
            text: gettext('Change'),
            iconPath: '/wlc/icons/arrow.svg',
        },
    },
    showSvgAsImg: true,
};
