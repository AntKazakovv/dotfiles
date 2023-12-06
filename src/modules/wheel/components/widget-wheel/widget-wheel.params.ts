import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ITimerCParams} from 'wlc-engine/modules/core';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;
export type AutoModifiers = ComponentTheme | ComponentThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IWidgetWheelCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    text?: string,
    timerParams?: ITimerCParams;
    rouletteIcon?: string;
    arrowIcon?: string;
}

export const defaultParams: IWidgetWheelCParams = {
    moduleName: 'wheel',
    componentName: 'wlc-widget-wheel',
    class: 'wlc-widget-wheel',
    text: gettext('Create a raffle'),
    rouletteIcon: '/wlc/icons/prize-wheel/roulette.svg',
    arrowIcon: '/wlc/icons/prize-wheel/roulette_arrow.svg',
};

export const timerParams: ITimerCParams = {
    common: {
        noDays: true,
        noHours: true,
    },
    acronyms: {
        minutes: gettext('min'),
        seconds: gettext('sec'),
    },
    dividers: {
        units: ' ',
        text: ' ',
    },
};
