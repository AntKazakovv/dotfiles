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
    container?: string | boolean;
    components?: (ILayoutComponent | string)[];
    modify?: ILayoutModifyItem[];
    modifiers?: string[];
}

// export interface ILayoutModify {
//     insert?: ILayoutModifyItem[];
//     replace?: ILayoutModifyItem[];
//     delete?: unknown;
// }

export interface ILayoutModifyItem {
    type: 'insert' | 'replace' | 'delete';
    position: string | number;
    component?: ILayoutComponent;
}


export interface ILayoutComponent {
    name: string;
    componentClass?: unknown;
    injector?: Injector;
    params?: unknown;
    show?: IComponentShowConfig;
    exclude?: string[];
    include?: string[];
}

export interface IComponentShowConfig {
    after?: number;
    before?: number;
    mobile?: boolean;
    auth?: boolean;
}
