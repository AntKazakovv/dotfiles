import {Injector} from '@angular/core';
import {TargetState} from '@uirouter/core';
import {AppType} from 'wlc-engine/modules/core';
import {IProfileConfig} from 'wlc-engine/modules/core/system/interfaces/base-config/profile.interface';
import {IDefaultConfig} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export type LayoutTitleHandlerType = (state: TargetState) => string;
export type LayoutTitleType = string | LayoutTitleHandlerType;

export interface ILayoutsConfig {
    [key: string]: ILayoutStateConfig;
}

export interface IPanelsConfig {
    [key: string]: IPanelsStateConfig;
}

export interface ILayoutStateConfig extends IDefaultConfig {
    title?: LayoutTitleType;
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
    replaceConfig?: boolean;
    container?: string | boolean;
    /** shows preloader before components are set */
    usePreloader?: boolean;
    components?: (ILayoutComponent | string)[];
    modify?: ILayoutModifyItem[];
    modifiers?: string[];
    theme?: string;
    order?: number;
    wlcElement?: string;
    display?: IDisplayConfig;
}

export interface IPanelSectionConfig extends ILayoutSectionConfig {
    hide?: boolean;
    showHeader?: boolean;
    showClose?: boolean;
    useScroll?: boolean;
    container?: string | boolean;
    type?: 'default' | 'fixed';
    display?: {
        /** display component after this window width */
        after?: number;
        /** display component before this window width */
        before?: number;
    };
}

export interface ILayoutModifyItem {
    type: 'insert' | 'replace' | 'delete' | 'merge';
    position: string | number;
    component?: ILayoutComponent | Partial<ILayoutComponent>;
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
    display?: IDisplayConfig;
    exclude?: string[];
    include?: string[];
    reloadOnStateChange?: boolean;
}

export interface IDisplayConfig {
    /** display component after this window width */
    after?: number;
    /** display component before this window width */
    before?: number;
    /** display component only on mobile when true, on desktop when false */
    mobile?: boolean;
    /** display component only auth user when true, anon user when false */
    auth?: boolean;
    /** display component only if there is a parameter in the config */
    configProperty?: string;
}

export interface IParamsLayoutConfig {
    appType: AppType;
    profile: IProfileConfig;
}
