import {IComponentParams, CustomType} from 'wlc-engine/modules/core';
import {LoyaltyLevelModel} from 'wlc-engine/modules/promo/system/models/loyalty-level.model';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ILevelNameParams extends IComponentParams<Theme, Type, ThemeMod> {
    /*
    * Level model
    * */
    level?: LoyaltyLevelModel;
}

export const defaultParams: ILevelNameParams = {
    class: 'wlc-level-name',
};
