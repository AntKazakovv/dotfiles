import {IComponentParams, CustomType} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IBonusModalCParams extends IComponentParams<Theme, Type, ThemeMod> {
    /** Object "Bonus" */
    bonus?: Bonus;
    /** Bonus item theme */
    bonusItemTheme?: string;
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
    /** Using icon */
    useIconBonusImage?: boolean;
    /** Background image */
    bgImage: string;
}

export const defaultParams: IBonusModalCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonus-modal',
    class: 'wlc-bonus-modal',
    iconType: 'svg',
    iconsPath: '/gstatic/bonuses/icons/',
    useIconBonusImage: true,
    bgImage: '/gstatic/wlc/bonuses/modal-bonus-default.png',
    fallback: {
        iconType: 'svg',
        IconsPath: '/gstatic/bonuses/icons/',
    },
};
