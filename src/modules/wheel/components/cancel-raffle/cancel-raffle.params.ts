import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;
export type AutoModifiers = ComponentTheme | ComponentThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ICancelRaffleCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    pathIllustration?: string,
}

export const defaultParams: ICancelRaffleCParams = {
    moduleName: 'wheel',
    componentName: 'wlc-cancel-raffle',
    class: 'wlc-cancel-raffle',
    pathIllustration: '/wlc/prize-wheel/null_participants.png',
};
