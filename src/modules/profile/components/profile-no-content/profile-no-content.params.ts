import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type Theme = 'default' | 'wolf' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IProfileNoContentCParams extends IComponentParams<Theme, Type, ThemeMod> {
    text?: string;
    iconPath?: string;
}

export const defaultParams: IProfileNoContentCParams = {
    moduleName: 'profile',
    componentName: 'wlc-profile-no-content',
    class: 'wlc-profile-no-content',
    text: gettext('No items available'),
    iconPath: '/wlc/icons/icons_new/empty-table-bg.svg',
};
