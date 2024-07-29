import {
    GlobalHelper,
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {IStoreItemParams} from 'wlc-engine/modules/store/system/interfaces/store.interface';
import {StoreItem} from 'wlc-engine/modules/store/system/models/store-item.model';

export type ComponentTheme = 'default' | 'first' | 'wolf' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'chip-v2' | CustomType;
export type AutoModifiers = ComponentTheme | ComponentThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;
export type TIconExtension = 'svg' | 'png' | 'jpg';

export interface IStoreItemCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ComponentThemeMod;
        customModifiers?: CustomMod;
        defaultPicPath: string;
        /** allows to use svg/png/jpg extension */
        iconFormat: TIconExtension;
    };
    storeItem?: StoreItem,
    storeItemParams?: IStoreItemParams,
    userLevel?: number,
}

export const defaultParams: IStoreItemCParams = {
    moduleName: 'store',
    componentName: 'wlc-store-item',
    class: 'wlc-store-item',
    common: {
        defaultPicPath: GlobalHelper.gstaticUrl + '/store/default-item.png',
        iconFormat: 'svg',
    },
};
