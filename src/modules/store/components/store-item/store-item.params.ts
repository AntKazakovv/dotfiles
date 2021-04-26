import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IStoreItemParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        customModifiers?: CustomMod;
        bonusIconsPath?: string;
        defaultPicPath: string;
        defaultPicPathFirst: string;
    };
}

export const defaultParams: IStoreItemParams = {
    moduleName: 'store',
    componentName: 'wlc-store-item',
    class: 'wlc-store-item',
    common: {
        bonusIconsPath: '/gstatic/bonuses/icons/',
        defaultPicPath: '/gstatic/store/default.png',
        defaultPicPathFirst: '/gstatic/store/default1.png',
    },
};
