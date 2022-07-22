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
export type ThemeMod = 'default' | 'with-image' | 'with-ears' | CustomType;
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
        blankBonus?: IBlankBonusParams;
    };
    itemsParams?: IBonusItemCParams;
    redirectBtnToProfile?: {
        use?: boolean;
        params?: IButtonCParams;
    },
    btnNoBonuses?: {
        use?: boolean;
        params?: IButtonCParams;
    },
    noContent?: BonusesListNoContentByThemeType;
    /**
     * Set 'true' to hide navigation buttons
     */
    hideNavigation?: boolean;
}

export interface IBlankBonusParams {
    id?: number;
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
            name: gettext('Without bonus'),
        },
    },
    btnNoBonuses: {
        use: false,
        params: {
            common: {
                text: gettext('Go home'),
                sref: 'app',
            },
        },
    },
    redirectBtnToProfile: {
        use: false,
        params: {
            wlcElement: 'button_go-to-profile',
            common: {
                text: gettext('Go to Profile'),
                sref: 'app.profile.loyalty-bonuses.main',
            },
        },
    },
};
