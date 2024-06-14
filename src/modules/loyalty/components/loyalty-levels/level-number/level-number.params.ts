import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {LoyaltyLevelModel} from 'wlc-engine/modules/loyalty/system/models/loyalty-level.model';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILevelNumberCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    item?: LoyaltyLevelModel,
    levelPrefix?: string,
    showLevelIcon?: boolean,
}

export const defaultParams: ILevelNumberCParams = {
    moduleName: 'loyalty',
    class: 'wlc-level-number',
    componentName: 'wlc-level-number',
    levelPrefix: gettext('Level'),
    showLevelIcon: false,
};
