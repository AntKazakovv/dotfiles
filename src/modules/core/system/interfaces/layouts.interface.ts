import {Injector} from '@angular/core';
import {IDefaultConfig} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export interface ILayoutsConfig {
    [key: string]: ILayoutStateConfig;
}

export interface IPanelsConfig {
    [key: string]: IPanelsStateConfig;
}

export interface ILayoutStateConfig extends IDefaultConfig {
    extends?: string;
    subcategories?: ILayoutsConfig;
    sections?: ILayoutSectionsConfig;
}

export interface IPanelsStateConfig extends ILayoutStateConfig {
    sections?: IPanelsSectionsConfig;
    subcategories?: IPanelsConfig;
}

export interface ILayoutSectionsConfig {
    [key: string]: ILayoutSectionConfig;
}

export interface IPanelsSectionsConfig {
    [key: string]: IPanelSectionConfig;
}

export interface ILayoutSectionConfig {
    container?: string | boolean;
    components?: (ILayoutComponent | string)[];
    modify?: ILayoutModifyItem[];
    modifiers?: string[];
    theme?: string;
    order?: number;
    wlcElement?: string;
}

export interface IPanelSectionConfig extends ILayoutSectionConfig {
    hide?: boolean;
    container?: string;
}

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
    /** component display parameters
     * @param after {number} display component after this window width
     * @param before {number} display component before this window width
     * @param mobile {boolean} display component only on mobile when true, on desktop when false
     * @param auth {boolean} display component only auth user when true, anon user when false
    */
    display?: IComponentDisplayConfig;
    exclude?: string[];
    include?: string[];
}

export interface IComponentDisplayConfig {
    /** display component after this window width */
    after?: number;
    /** display component before this window width */
    before?: number;
    /** display component only on mobile when true, on desktop when false */
    mobile?: boolean;
    /** display component only auth user when true, anon user when false */
    auth?: boolean;
}
