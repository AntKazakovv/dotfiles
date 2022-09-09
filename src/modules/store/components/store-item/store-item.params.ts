import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Type = 'default' | CustomType;
export type Theme = 'default' | 'first' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;
export type TIconExtension = 'svg' | 'png' | 'jpg';

export interface IStoreItemCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        customModifiers?: CustomMod;
        defaultPicPath: string;
        defaultPicPathFirst: string;
        /** allows to use svg/png/jpg extension */
        iconFormat: TIconExtension;
    };
}

export const defaultParams: IStoreItemCParams = {
    moduleName: 'store',
    componentName: 'wlc-store-item',
    class: 'wlc-store-item',
    common: {
        defaultPicPath: '/gstatic/store/default.png',
        defaultPicPathFirst: '/gstatic/store/default1.png',
        iconFormat: 'svg',
    },
};
