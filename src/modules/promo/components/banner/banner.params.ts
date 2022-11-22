import {CustomType, IComponentParams} from 'wlc-engine/modules/core';
import {BannerModel, IBannersFilter} from 'wlc-engine/modules/promo';

export type ComponentTheme = 'default' | 'default-banner' | 'game-banner' | CustomType;
export type ComponentMod = 'default' | 'signin' | 'mobile-app' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IBannerCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentMod> {
    banner?: BannerModel;
    filter?: IBannersFilter;
}

export const defaultParams: IBannerCParams = {
    class: 'wlc-banner',
};
