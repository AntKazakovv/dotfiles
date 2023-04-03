import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {LootboxPrizeModel} from 'wlc-engine/modules/bonuses/system/models/lootbox-prize/lootbox-prize.model';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ILootboxPrizeCParams extends IComponentParams<Theme, Type, ThemeMod> {
    /** Lootbox prize */
    prize: LootboxPrizeModel;
    /** Icon path */
    iconPath?: string;
    /** Name line clamp */
    /**
     * @deprecated
     * Will be removed
     */
    nameClamp?: number;
}

export const defaultParams: Partial<ILootboxPrizeCParams> = {
    moduleName: 'bonuses',
    componentName: 'wlc-lootbox-prize',
    class: 'wlc-lootbox-prize',
    iconPath: '/bonuses/icons/lootbox.svg',
};
