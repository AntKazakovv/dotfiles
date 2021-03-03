import {
    Injector,
} from '@angular/core';

import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

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

export interface ITabSwitcherParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    tabs?: ITab[]
}

export const defaultParams: ITabSwitcherParams = {
    moduleName: 'core',
    class: 'wlc-tab-switcher',
    componentName: 'wlc-tab-switcher',
};
