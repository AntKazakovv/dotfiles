import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IStoreItemTotalPrice} from 'wlc-engine/modules/store/system/interfaces/store.interface';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IStoreItemPriceCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    isHistory?: boolean;
    storeItemTotalPrice?: IStoreItemTotalPrice
}

export const defaultParams: IStoreItemPriceCParams = {
    moduleName: 'store',
    componentName: 'wlc-store-item-price',
    class: 'wlc-store-item-price',
    isHistory: false,
};
