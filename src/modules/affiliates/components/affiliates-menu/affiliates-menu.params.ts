import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IAffiliatesMenuCParams extends IComponentParams<Theme, Type, ThemeMod> {
    menuParams?: MenuParams.IMenuCParams
};

export const defaultParams: IAffiliatesMenuCParams = {
    moduleName: 'affiliates',
    componentName: 'wlc-affiliates-menu',
    class: 'wlc-affiliates-menu',
    menuParams: {
        type: 'affiliates-menu',
        items: [],
    },
};
