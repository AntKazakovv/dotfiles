import {
    IAccordionCParams,
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
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
    /** If `true` - hides bonus buttons component */
    hideBonusButtons?: boolean;
    /** Object accordion params */
    accordionParams?: IAccordionCParams,
}

export const defaultParams: IBonusModalCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonus-modal',
    class: 'wlc-bonus-modal',
};
