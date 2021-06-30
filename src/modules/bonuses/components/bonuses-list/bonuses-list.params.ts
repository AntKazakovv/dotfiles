import {SwiperOptions} from 'swiper';

import {
    IComponentParams,
    CustomType,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {
    IBonusItemCParams,
    RestType,
    BonusesFilterType,
} from 'wlc-engine/modules/bonuses';

export type Type = 'default' | 'swiper' | CustomType;
export type Theme = 'active'| 'default' | 'partial' | 'promo' | 'promo-home' | 'reg-first' | CustomType;
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
        swiperManualTransitionDuration?: number;
        useBlankBonus?: boolean;
        selectFirstBonus?: boolean;
        useRecommendedBonuses?: boolean;
        useNoDataText?: boolean;
        useQuery?: boolean;
    };
    itemsParams?: IBonusItemCParams,
    useRedirectBtnToProfile?: boolean,
    redirectBtnToProfile?: IButtonCParams,
    useBtnNoBonuses?: boolean,
    btnNoBonuses?: IButtonCParams,
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
        swiperManualTransitionDuration: 750,
        useRecommendedBonuses: false,
        useQuery: false,
        useNoDataText: false,
    },
    useBtnNoBonuses: true,
    btnNoBonuses: {
        common: {
            text: gettext('Go home'),
            sref: 'app',
        },
    },
    useRedirectBtnToProfile: false,
    redirectBtnToProfile: {
        wlcElement: 'button_go-to-profile',
        common: {
            text: gettext('Go to Profile'),
            sref: 'app.profile.loyalty-bonuses.main',
        }
    },
};
