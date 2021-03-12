import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus';
import {IIndexing} from 'wlc-engine/modules/core';

export type Type = 'default' | 'reg' | 'deposit' | 'promo' | 'store' | 'active' | 'inventory' | CustomType;
export type Theme = 'default' | 'long' | 'grid' | 'partial' | 'preview' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ILinkParams {
    state: string;
    params?: IIndexing<string>;
}
export interface IBonusItemCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    bonus?: Bonus,
    theme?: Theme,
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
        bonus?: Bonus;
        nameClamp?: number;
        usePreviewBonus?: boolean,
        promoLinks?: {
            deposit?: ILinkParams,
            play?: ILinkParams,
        };
    };
}

export const defaultParams: IBonusItemCParams = {
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
        nameClamp: 1,
        usePreviewBonus: false,
        promoLinks: {
            deposit: {
                state: 'app.profile.cash.deposit',
            },
            play: {
                state: 'app.catalog',
                params: {
                    category: 'casino',
                },
            },
        },
    },
};
