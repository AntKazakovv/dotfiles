import {Injector} from '@angular/core';
import {IDefaultConfig} from 'wlc-engine/interfaces/config.interface';

export interface ILayoutsConfig {
    [key: string]: ILayoutStateConfig;
}

export interface ILayoutStateConfig extends IDefaultConfig {
    extends?: string;
    sections?: ILayoutSectionsConfig;
}

export interface ILayoutSectionsConfig {
    [key: string]: ILayoutSectionConfig;
}

export interface ILayoutSectionConfig {
    components?: (ILayoutComponent | string)[];
}

export interface ILayoutComponent {
    name: string;
    componentClass?: unknown;
    injector?: Injector;
    params?: unknown;
}
