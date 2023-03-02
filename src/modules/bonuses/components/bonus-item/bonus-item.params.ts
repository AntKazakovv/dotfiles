import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {IBonusModalCParams} from 'wlc-engine/modules/bonuses/components/bonus-modal/bonus-modal.params';

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
    | 'mini' // deposit mini items
    | CustomType;
export type ThemeMod = 'default'
    | 'active'
    | 'chip-v2'
    | 'with-image'
    | 'simple' // simple preview on button, use with theme `mini`.
    | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IBonusItemCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    bonus?: Bonus,
    dummy?: boolean;
    /** Make the bonus logic independent of the profile */
    noDependsOnProfile?: boolean;
    /** Default blamk bonus image */
    blankBonusImage?: string;
    /** Default dummy bonus image */
    dummyBonusImage?: string;
    common?: {
        customModifiers?: CustomMod;
        showAdditionalImage?: boolean;
        showBonusTag?: boolean;
        hideDescription?: boolean;
        hideChooseBtn?: boolean;
        iconMoreBtn?: boolean;
        nameClamp?: number;
        usePreviewBonus?: boolean;
        descriptionClamp?: number;
    };
    /**
     * Params for bonus modal
     */
    bonusModalParams?: IBonusModalCParams;
    /**
     * If `true` - hides `wlc-bonus-item__bottom` block
     */
    hideBonusBottom?: boolean;
    /** Use bg image on mobile partial theme */
    usePartialMobileImage?: boolean;
}

export const defaultParams: IBonusItemCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonus-item',
    class: 'wlc-bonus-item',
    blankBonusImage: '/gstatic/wlc/bonuses/blank-bonus-decor.png',
    dummyBonusImage: '/gstatic/wlc/bonuses/bonus-dummy.svg',
    common: {
        showAdditionalImage: false,
        showBonusTag: true,
        hideDescription: false,
        iconMoreBtn: true,
        hideChooseBtn: true,
        nameClamp: 1,
        descriptionClamp: 3,
        usePreviewBonus: false,
    },
    usePartialMobileImage: false,
};
