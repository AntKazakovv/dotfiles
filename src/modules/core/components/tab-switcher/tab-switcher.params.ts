import {
    Injector,
} from '@angular/core';

import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ThemeMod = 'default' | 'with-banner' | 'first' | 'skip-bonus' | 'with-promo' | CustomType;

export interface ITab {
    name?: string;
    startTab?: string;
    active: boolean;
    component?: string;
    componentClass?: unknown;
    componentParams?: unknown;
    injector?: Injector;
    modifier?: string;
    modalId?: string;
};

export interface ITabSwitcherParams extends IComponentParams<ComponentTheme, ComponentType, ThemeMod> {
    tabs?: ITab[];
    theme?: ComponentTheme;
    themeMod?: ThemeMod;
}

export const defaultParams: ITabSwitcherParams = {
    moduleName: 'core',
    class: 'wlc-tab-switcher',
    componentName: 'wlc-tab-switcher',
};
