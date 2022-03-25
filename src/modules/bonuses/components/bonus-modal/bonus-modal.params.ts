import {IComponentParams, CustomType} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus';
import {Theme as BonusItemTheme} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.params';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IBonusModalCParams extends IComponentParams<Theme, Type, ThemeMod> {
    /** Object "Bonus" */
    bonus?: Bonus;
    /** Bonus item theme */
    bonusItemTheme?: BonusItemTheme;
    /** Extension icon */
    iconType?: string;
    /** Path to icon folder */
    iconsPath?: string;
    /** Object with settings for reserve icons */
    fallback?: {
        /** Extension icon */
        iconType?: string;
        /** Path to icon folder */
        IconsPath?: string;
    };
    /** Background image */
    bgImage: string;
}

export const defaultParams: IBonusModalCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonus-modal',
    class: 'wlc-bonus-modal',
    iconType: 'svg',
    iconsPath: '/gstatic/bonuses/icons/',
    bgImage: '/gstatic/wlc/bonuses/modal-bonus-default.png',
    fallback: {
        iconType: 'svg',
        IconsPath: '/gstatic/bonuses/icons/',
    },
};
