import {Injector} from '@angular/core';

export interface ILayoutsConfig {
    [key: string]: ILayoutStateConfig;
}

export interface ILayoutStateConfig {
    extends?: string;
    sections?: ILayoutSectionsConfig;
}

export interface ILayoutSectionsConfig {
    [key: string]: ILayoutSectionConfig;
}

export interface ILayoutSectionConfig {
    container?: string | boolean;
    components?: (ILayoutComponent | string)[];
}

export interface ILayoutComponent {
    name: string;
    componentClass?: unknown;
    injector?: Injector;
    params?: unknown;
}
