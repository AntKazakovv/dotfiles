import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {LoyaltyLevelModel} from 'wlc-engine/modules/loyalty/system/models/loyalty-level.model';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ILevelNumberParams extends IComponentParams<Theme, Type, ThemeMod> {
    item?: LoyaltyLevelModel,
    levelPrefix?: string,
    showLevelIcon?: boolean,
}

export const defaultParams: ILevelNumberParams = {
    moduleName: 'loyalty',
    class: 'wlc-level-number',
    componentName: 'wlc-level-number',
    levelPrefix: gettext('Level'),
    showLevelIcon: false,
};
