import {SwiperOptions} from 'swiper';

import {
    IComponentParams,
    CustomType,
    IPagination,
    IButtonCParams,
    INoContentCParams,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {
    IBonusItemCParams,
    RestType,
    BonusesFilterType,
} from 'wlc-engine/modules/bonuses';
import {TBonusSortOrder} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';

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
        blankBonus?: IBlankBonusParams,
        useNoActiveItem?:boolean,
        useNoOffersItem?:boolean,
        noActiveImgPath?:string,
        noOffersImgPath?:string,
    };
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
    useBtnScroll?: boolean,
    btnScroll?: IButtonCParams,
    itemsParams?: IBonusItemCParams,
    /** is bonuses list in profile */
    inProfile?: boolean,
    /** wlc-profile-no-content params */
    emptyInProfileConfig?: IWrapperCParams,
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
    useBtnScroll: false,
    btnScroll: {
        common: {
            text: gettext('Select a bonus'),
            selectorScroll: '.wlc-profile-content__header--second',
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
    emptyInProfileConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    text: gettext('No bonuses available'),
                },
            },
        ],
    },
};
