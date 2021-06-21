import {CustomType, IComponentParams} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILoyaltyProgressCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    common?: {
        maxProgressText?: string;
    };
}

export const defaultParams: ILoyaltyProgressCParams = {
    moduleName: 'user',
    componentName: 'wlc-loyalty-progress',
    class: 'wlc-loyalty-progress',
    common: {
        maxProgressText: gettext('Max'),
    },
};
