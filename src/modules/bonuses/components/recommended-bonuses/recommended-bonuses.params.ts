import {SwiperOptions} from 'swiper';

import {
    CustomType,
    IComponentParams,
    IPagination,
} from 'wlc-engine/modules/core';
import {
    BonusesFilterType,
    RestType,
} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses.interface';
import {TBonusSortOrder} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses.interface';
import {IBonusItemCParams} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.params';

export type Type = 'default' | 'swiper' | CustomType;
export type Theme = 'default' | 'active' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ICommonParams {
    theme?: Theme,
    themeMod?: ThemeMod;
    customModifiers?: CustomMod;
    restType?: RestType;
    filter?: BonusesFilterType;
    filterByGroup?: string;
    sortOrder?: TBonusSortOrder[];
    swiper?: SwiperOptions;
    useQuery?: boolean;
    /**
     * the value containing pagination usage and breakpoints
     */
    pagination?: IPagination;
}

export enum RecommendedListEvents {
    RecommendedListVisibility = 'RECOMMENDED_LIST_VISIBILITY',
}

export interface ICRecommendedBonusesParams extends IComponentParams<Theme, Type, string> {
    modifiers?: Modifiers[];
    common?: ICommonParams;
    itemsParams?: IBonusItemCParams;
    recommendParams?: ICommonParams;
    useNoDataText?: boolean;
}

export const defaultParams: ICRecommendedBonusesParams = {
    moduleName: '',
    class: 'wlc-recommended-bonuses',
    componentName: 'wlc-recommended-bonuses',
    common: {
        useQuery: false,
    },
    useNoDataText: false,
};
