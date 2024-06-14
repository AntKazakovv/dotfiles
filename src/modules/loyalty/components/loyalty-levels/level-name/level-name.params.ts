import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {LoyaltyLevelModel} from 'wlc-engine/modules/loyalty/system/models/loyalty-level.model';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILevelNameCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /*
    * Level model
    * */
    level?: LoyaltyLevelModel;
}

export const defaultParams: ILevelNameCParams = {
    moduleName: 'loyalty',
    class: 'wlc-level-name',
    componentName: 'wlc-level-name',
};
