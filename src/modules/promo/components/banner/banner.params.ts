import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {BannerModel} from 'wlc-engine/modules/promo/system/models/banner.model';

export type ComponentTheme = 'default';
export type ComponentType = 'default';

export interface IBannerCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    banner?: BannerModel;
    class?: string;
}

export const defaultParams: IBannerCParams = {
    class: 'wlc-banner',
};
