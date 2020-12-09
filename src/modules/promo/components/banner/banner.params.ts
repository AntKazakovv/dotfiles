import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {BannerModel} from 'wlc-engine/modules/promo/system/models/banner.model';

export type ComponentTheme = 'default';
export type ComponentType = 'default';

export interface IBannerParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    params?: BannerModel[];
    class?: string;
    html?: string;
}

export const defaultParams: IBannerParams = {
    class: 'wlc-banner',
};
