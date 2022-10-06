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

export interface IOfflinePageCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
    };
    /**
     * Path to image
     */
    image?: string;
}

export const defaultParams: IOfflinePageCParams = {
    moduleName: 'core',
    componentName: 'wlc-offline-page',
    class: 'wlc-offline-page',
    image: '/offline.svg',
};
