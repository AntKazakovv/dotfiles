import {
    IComponentParams,
    CustomType,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {IBonusModalCParams} from 'wlc-engine/modules/bonuses/components/bonus-modal/bonus-modal.params';
import {Size} from 'wlc-engine/modules/core/components/button/button.params';
import {IAlertCParams} from 'wlc-engine/modules/core/components/alert/alert.params';

/**
 * reg type used only in wolf and further
 */
export type Type = 'default' | 'reg' | CustomType;
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
    | 'wolf'
    | 'name-only'
    | CustomType;
export type ThemeMod = 'default'
    | 'active'
    | 'chip-v2'
    | 'with-image'
    | 'simple' // simple preview on button, use with theme `mini`.
    | 'horizontal' // wolf and further mode
    | 'vertical' // wolf and further mode
    | 'mini-wolf' // wolf mode deposit mini items
    | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;
export type TBonusItemImageSource = 'image'
    | 'imageDescription'
    | 'imageOther'
    | 'imagePromo'
    | 'imageReg'
    | 'imageStore'
    | 'imagePromoHome'
    | 'imageProfileFirst'
    | 'imageDeposit';

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
        /**
         * @deprecated
         * Will be removed
         */
        nameClamp?: number;
        usePreviewBonus?: boolean;
        /**
         * @deprecated
         * Will be removed
         */
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
    buttonsParams?: {
        /** Size of buttons inside the bonus item */
        size?: Size;
        hideButtons?: boolean;
    };
    buttonsSize?: Size;
    bonusUnavailableAlertParams?: IAlertCParams;
    bonusAllowStackAlertParams?: IAlertCParams;
    bonusNonCancelableAlertParams?: IAlertCParams;
    useReadMoreBtnMode?: boolean;
    imageSource?: TBonusItemImageSource;
}

export type TBonusClickAction = 'showDescription' | string;

export const defaultParams: IBonusItemCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonus-item',
    class: 'wlc-bonus-item',
    blankBonusImage: GlobalHelper.gstaticUrl + '/wlc/bonuses/blank-bonus-decor.png',
    dummyBonusImage: GlobalHelper.gstaticUrl + '/wlc/bonuses/bonus-dummy.svg',
    common: {
        showAdditionalImage: false,
        showBonusTag: true,
        hideDescription: false,
        iconMoreBtn: true,
        hideChooseBtn: true,
        usePreviewBonus: false,
    },
    usePartialMobileImage: false,
    bonusUnavailableAlertParams: {
        title: gettext('This bonus cannot be activated due to the presence of another active bonus'),
        level: 'warning',
    },
    bonusAllowStackAlertParams: {
        title: gettext('The bonus allows stacking'),
        level: 'info',
    },
    bonusNonCancelableAlertParams: {
        title: gettext('The bonus does not allow cancellation. Wager this bonus to claim a new one'),
        level: 'warning',
    },
};
