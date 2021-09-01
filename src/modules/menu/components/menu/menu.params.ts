import {IComponentParams, ICounterType} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {ISliderCParams} from 'wlc-engine/modules/promo';
import {TIconExtension} from 'wlc-engine/modules/menu';
import {
    IMenuOptions,
} from 'wlc-engine/modules/core';

export interface MenuConfigItemsGroup {
    parent: MenuItemsGroupParent;
    type: string;
    items: MenuItemsGroupItem[];
}
export type MenuItemsGroupItem = string | IMenuItem | MenuConfigItemsGroup;
export type MenuItemsGroupParent = string | IMenuItem;
export type MenuConfigItem = MenuConfigItemsGroup | IMenuItem | string;
export type MenuItemObjectType = IMenuItem | IMenuItemsGroup;
export type MenuItemType = string | IMenuItem | IMenuItemsGroup;
export type MenuType = 'main-menu'
    | 'category-menu'
    | 'profile-menu'
    | 'profile-first-menu'
    | 'mobile-menu'
    | 'footer:tc'
    | 'footer:about'
    | 'affiliates-menu'
    | 'burger-panel-header';
export type ItemType = 'sref' | 'anchor' | 'modal' | 'href' | 'scroll' | 'title' | 'dropdown' | 'group';
export type IMenuTarget = '_blank' | '_self' | '_parent' | '_top';
export type MenuTheme = string;
export type TMenuItemDevice = 'mobile' | 'desktop' | 'all';

export interface IMenuItemParamsState {
    parent?: string | string[];
    activeEq?: boolean;
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

export interface IMenuItemParamsHref {
    url: string;
    baseSiteUrl?: boolean;
}

export interface IMenuItemParams {
    state?: IMenuItemParamsState;
    anchor?: IMenuItemParamsAnchor;
    scroll?: string;
    modal?: IMenuItemParamsModal;
    href?: string | IMenuItemParamsHref;
    target?: IMenuTarget;
    blockExpand?: boolean;
}

export interface IMenuItem {
    name: string;
    type: ItemType;
    counter?: ICounterType;
    icon?: string;
    iconPath?: string;
    iconUrl?: string;
    class?: string;
    wlcElement?: string;
    params?: IMenuItemParams;
    device?: TMenuItemDevice;
    auth?: boolean;
    sort?: number,
}

export interface IMenuItemsGroup {
    parent: IMenuItem,
    items: MenuItemObjectType[],
    type?: ItemType,
    counter?: ICounterType;
    expand?: boolean;
}

export interface IMenuCParams extends IComponentParams<MenuTheme, MenuType, string> {
    sliderParams?: ISliderCParams,
    common?: {
        useSwiper?: boolean;
        swiper?: {
            scrollToStart: boolean;
        },
        icons?: {
            fallback?: string;
            extension?: TIconExtension;
        };
        scrollToSelector?: string;
    },
    items?: MenuItemType[];
    scrollDuration?: number;
}

export interface IMenuItemsGlobal {
    [key: string]: IMenuItem;
}

export interface IMenuItemGroupsGlobal {
    [key: string]: MenuConfigItemsGroup;
}

export interface IHelperGetItemsParams {
    isMobile: boolean;
    isAuth: boolean;
    items?: MenuItemType[];
    type?: MenuType;
    theme?: string;
}

export interface IHelperGetItemsForCategories {
    categories: CategoryModel[];
    lang: string;
    openChildCatalog?: boolean;
    menuSettings?: IMenuOptions;
    wlcElementPrefix?: string;
    icons?: {
        folder?: string;
        disable?: boolean;
        fallback?: string;
    };
}

export const defaultParams: IMenuCParams = {
    moduleName: 'menu',
    componentName: 'wlc-menu',
    class: 'wlc-menu',
    common: {
        icons: {
            extension: 'svg',
            fallback: '',
        },
    },
    scrollDuration: 300,
    sliderParams: {
        swiper: {
            direction: 'horizontal',
            slidesPerView: 'auto',
            spaceBetween: 10,
        },
    },
};
