import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Type = 'default' | 'reg' | 'deposit' | 'promo' | 'store' | 'active' | 'inventory' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IBonusItemParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        customModifiers?: CustomMod;
        type?: Type;
        imageByType?: boolean;
        useIconBonusImage?: boolean;
        showAdditionalImage?: boolean;
        showBonusTag?: boolean;
        hideDescription?: boolean;
        hideChooseBtn?: boolean;
        iconMoreBtn?: boolean;
        iconsPath?: string;
    };
}

export const defaultParams: IBonusItemParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonus-item',
    class: 'wlc-bonus-item',
    common: {
        imageByType: false,
        useIconBonusImage: true,
        showAdditionalImage: false,
        showBonusTag: true,
        hideDescription: false,
        iconMoreBtn: true,
        hideChooseBtn: true,
        iconsPath: '/gstatic/bonuses/icons/',
    },
};
