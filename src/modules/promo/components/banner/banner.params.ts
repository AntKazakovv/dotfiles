import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {BannerModel} from 'wlc-engine/modules/promo/system/models/banner.model';

export type ComponentTheme = 'default' | 'default-banner' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IBannerCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    banner?: BannerModel;
    class?: string;
}

export const defaultParams: IBannerCParams = {
    class: 'wlc-banner',
};
