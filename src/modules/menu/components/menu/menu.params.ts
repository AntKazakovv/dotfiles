import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';

export interface MenuConfigItemsGroup {
    parent: string;
    items: string[];
}
export type MenuConfigItem = MenuConfigItemsGroup | string
export type MenuItemObjectType = IMenuItem | IMenuItemsGroup;
export type MenuItemType = string | IMenuItem | IMenuItemsGroup;
export type MenuType = 'main-menu' | 'category-menu' | 'profile-menu' | 'mobile-menu' | 'footer:tc' | 'footer:about';
export type ItemType = 'sref' | 'anchor' | 'modal' | 'href' | 'scroll' | 'title' | 'dropdown';
export type IMenuTarget = '_blank' | '_self' | '_parent' | '_top';
export type MenuTheme = string;

export interface IMenuItemParamsState {
    parent?: string;
    name: string;
    params?: {
        [key: string]: any;
    };
    options?: {
        [key: string]: any;
    };
}

export interface IMenuItemParamsAnchor {
    name: string;
}

export interface IMenuItemParamsModal {
    name: string;
    params?: any;
}

export interface IMenuItemParams {
    state?: IMenuItemParamsState;
    anchor?: IMenuItemParamsAnchor;
    scroll?: string;
    modal?: IMenuItemParamsModal;
    href?: string;
    target?: IMenuTarget;
}

export interface IMenuItem {
    name: string;
    type: ItemType;
    icon?: string;
    class?: string;
    params?: IMenuItemParams;
}

export interface IMenuItemsGroup {
    parent: IMenuItem,
    items: IMenuItem[],
    expand?: boolean;
}

export interface IMenuCParams extends IComponentParams<MenuTheme, MenuType, string> {
    common?: {
        useArrow: boolean;
    },
    items?: MenuItemType[];
}

export interface IMenuItemsGlobal {
    [key: string]: IMenuItem;
}

export interface IHelperGetItemsParams {
    items?: MenuItemType[];
    type?: MenuType;
    theme?: string,
}

export interface IHelperGetItemsForCategories {
    openChildCatalog?: boolean;
    categories: CategoryModel[];
    lang: string;
}

export const defaultParams: IMenuCParams = {
    moduleName: 'menu',
    componentName: 'wlc-menu',
    class: 'wlc-menu',
};
