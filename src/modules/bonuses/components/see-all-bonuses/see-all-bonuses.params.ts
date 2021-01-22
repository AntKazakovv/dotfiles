import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ISeeAllBonusesParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {};
}

export const defaultParams: ISeeAllBonusesParams = {
    moduleName: 'bonuses',
    class: 'wlc-see-all-bonuses',
};
