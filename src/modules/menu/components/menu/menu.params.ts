import {IComponentParams} from 'wlc-engine/interfaces/config.interface';
import {CategoryModel} from 'wlc-engine/modules/games/models/category.model';

export type MenuItemType = string | IMenuItem;
export type MenuType = 'main-menu' | 'category-menu' | 'profile' | 'footer:tc' | 'footer:about';
export type ItemType = 'sref' | 'anchor' | 'modal' | 'href' | 'scroll';
export type IMenuTarget = '_blank' | '_self' | '_parent' | '_top';
export type MenuTheme = string;

export interface IMenuItemParamsState {
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

export interface IMenuCParams extends IComponentParams<MenuTheme, MenuType, string> {
    common?: {},
    items?: MenuItemType[];
}

export interface IMenuItemsGlobal {
    [key: string]: IMenuItem;
}

export interface IHelperGetItemsParams {
    items?: MenuItemType[];
    type?: MenuType;
}

export interface IHelperGetItemsForCategories {
    openChildCatalog?: boolean;
    categories: CategoryModel[];
    lang: string;
}

export const defaultParams: IMenuCParams = {
    class: 'wlc-menu',
};
