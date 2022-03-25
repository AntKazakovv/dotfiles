import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus';

export type Type = 'default' | CustomType;
export type Theme = 'active'
    | 'default'
    | 'long'
    | 'partial'
    | 'preview'
    | 'promo'
    | 'promo-home'
    | 'reg-first'
    | 'modal'
    | CustomType;
export type ThemeMod = 'default' | 'active' | 'chip-v2' | 'with-image' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IBonusItemCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    bonus?: Bonus,
    dummy?: boolean;
    /** Make the bonus logic independent of the profile */
    noDependsOnProfile?: boolean;
    common?: {
        customModifiers?: CustomMod;
        showAdditionalImage?: boolean;
        showBonusTag?: boolean;
        hideDescription?: boolean;
        hideChooseBtn?: boolean;
        iconMoreBtn?: boolean;
        iconsPath?: string;
        nameClamp?: number;
        usePreviewBonus?: boolean;
        descriptionClamp?: number;
    };
}

export const defaultParams: IBonusItemCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonus-item',
    class: 'wlc-bonus-item',
    common: {
        showAdditionalImage: false,
        showBonusTag: true,
        hideDescription: false,
        iconMoreBtn: true,
        hideChooseBtn: true,
        iconsPath: '/gstatic/bonuses/icons/',
        nameClamp: 1,
        descriptionClamp: 3,
        usePreviewBonus: false,
    },
};
