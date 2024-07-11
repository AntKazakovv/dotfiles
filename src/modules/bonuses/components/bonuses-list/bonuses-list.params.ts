import {SwiperOptions} from 'swiper/types/swiper-options';

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
    IQueryFilters,
} from 'wlc-engine/modules/bonuses';
import {TBonusSortOrder} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';
import {IPreloaderCParams} from 'wlc-engine/modules/core/components/preloader/preloader.params';
import {ISectionTitleCParams} from 'wlc-engine/modules/core/components/section-title/section-title.params';
import {ISliderNavigationCParams} from 'wlc-engine/modules/core/components/slider-navigation/slider-navigation.params';

export type Type = 'default' | 'swiper' | CustomType;
export type Theme = 'active' | 'default' | 'partial' | 'promo' | 'promo-home' | 'reg-first' | 'wolf' | CustomType;
export type ThemeMod = 'default' | 'with-image' | 'with-ears' | 'wolf' | 'horizontal' | 'vertical' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;
export type BonusesListNoContentByThemeType = Partial<Record<Theme, INoContentCParams>>;
export type TBonusesListPlacement = 'profile-dashboard'
    | 'profile-recommended'
    | 'reg'
    | 'reg-first'
    | 'home-promo';

export interface IBonusesListCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        customModifiers?: CustomMod;
        restType?: RestType;
        /**
         * Filter on program-level
         * */
        filter?: BonusesFilterType;
        /**
         * @Deprecated
         * Use queryFilters instead
         * */
        filterByGroup?: string;
        /**
         * Filter on request-level
         * */
        queryFilters?: IQueryFilters;
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
    placement?: TBonusesListPlacement;
    /** wlc-profile-no-content params */
    emptyInProfileConfig?: IWrapperCParams,
    preloader?: {
        /** use preloader or not */
        use?: boolean;
        /** wlc-preloader params */
        params?: IPreloaderCParams;
    }
    /** Section title params. Used in wolf theme and further */
    titleParams?: ISectionTitleCParams;
    /** Params for All button. Used in wolf theme and further */
    allBtnParams?: IButtonCParams;
    navigationParams?: ISliderNavigationCParams;
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
    preloader: {
        use: false,
    },
};
