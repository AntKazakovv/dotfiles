import {SwiperOptions} from 'swiper';

import {
    IComponentParams,
    CustomType,
    IPagination,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {
    IBonusItemCParams,
    RestType,
    BonusesFilterType,
} from 'wlc-engine/modules/bonuses';
import {INoContentCParams} from 'wlc-engine/modules/core/components/no-content/no-content.params';
import {TBonusSortOrder} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses.interface';

export type Type = 'default' | 'swiper' | CustomType;
export type Theme = 'active' | 'default' | 'partial' | 'promo' | 'promo-home' | 'reg-first' | CustomType;
export type ThemeMod = 'default' | 'with-image' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;
export type BonusesListNoContentByThemeType = Partial<Record<Theme, INoContentCParams>>;

export interface IBonusesListCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        customModifiers?: CustomMod;
        restType?: RestType;
        filter?: BonusesFilterType;
        filterByGroup?: string;
        sortOrder?: TBonusSortOrder[];
        swiper?: SwiperOptions;
        swiperManualTransitionDuration?: number;
        useBlankBonus?: boolean;
        selectFirstBonus?: boolean;
        pagination?: IPagination;
        useRecommendedBonuses?: boolean;
        useNoDataText?: boolean;
        useQuery?: boolean;
        blankBonus?: IBlankBonusParams,
    };
    itemsParams?: IBonusItemCParams,
    useRedirectBtnToProfile?: boolean,
    redirectBtnToProfile?: IButtonCParams,
    useBtnNoBonuses?: boolean,
    btnNoBonuses?: IButtonCParams,
    noContent?: BonusesListNoContentByThemeType,
}

export interface IBlankBonusParams {
    id?: number;
    type?: string;
    name?: string;
    description?: string;
    isChoose?: boolean;
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
        blankBonus: {
            id: null,
            type: 'blank',
            name: gettext('Without bonus'),
        },
    },
    useBtnNoBonuses: false,
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
        },
    },
};
