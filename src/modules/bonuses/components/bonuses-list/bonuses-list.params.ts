import {SwiperOptions} from 'swiper';
import {IBonusItemCParams} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.params';

import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    RestType,
    BonusesFilterType,
} from '../../system/interfaces/bonuses.interface';

export type Type = 'default' | 'swiper' | CustomType;
export type Theme = 'default' | 'partial' | 'promo-home' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IBonusesListCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        customModifiers?: CustomMod;
        restType?: RestType;
        filter?: BonusesFilterType;
        filterByGroup?: string;
        sortOrder?: ('active' | 'subscribe' | 'inventory' | number)[];
        swiper?: SwiperOptions;
        useBlankBonus?: boolean;
        selectFirstBonus?: boolean;
    };
    itemsParams?: IBonusItemCParams,
}


export const defaultParams: IBonusesListCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonuses-list',
    class: 'wlc-bonuses-list',
    theme: 'default',
    common: {
        restType: 'any',
        filter: 'all',
        useBlankBonus: false,
        selectFirstBonus: false,
    },
};
