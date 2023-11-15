import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IBonusWagerCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {

};

export const defaultParams: IBonusWagerCParams = {
    class: 'wlc-bonus-wager',
    componentName: 'wlc-bonus-wager',
    moduleName: 'bonuses',
};
