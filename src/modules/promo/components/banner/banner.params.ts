import {IComponentParams} from 'wlc-engine/interfaces/config.interface';
import {BannerModel} from 'wlc-engine/modules/promo/models/banner.model';

export type ComponentTheme = 'default';
export type ComponentType = 'default';

export interface IBannerParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    params?: BannerModel[];
    class?: string;
}

export const defaultParams: IBannerParams = {
    class: 'wlc-banner',
};
