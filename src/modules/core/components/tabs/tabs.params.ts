import {BehaviorSubject} from 'rxjs';

import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'rounding' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Modifiers = 'default' | CustomType;

export interface ITab {
    value: string;
    title: string;
}

export interface ITabsCParams extends IComponentParams<ComponentTheme, ComponentType, Modifiers> {
    tabs: ITab[];
    selectTab$: BehaviorSubject<string>;
}

export const defaultParams: ITabsCParams = {
    moduleName: 'core',
    componentName: 'wlc-tabs',
    class: 'wlc-tabs',
    theme: 'rounding',
    tabs: [],
    selectTab$: new BehaviorSubject(null),
};
