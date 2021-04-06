import {IComponentParams, ICounterType} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {ISliderCParams} from 'wlc-engine/modules/promo';

export interface MenuConfigItemsGroup {
    parent: string;
    items: string[];
}
export type MenuConfigItem = MenuConfigItemsGroup | IMenuItem | string;
export type MenuItemObjectType = IMenuItem | IMenuItemsGroup;
export type MenuItemType = string | IMenuItem | IMenuItemsGroup;
export type MenuType = 'main-menu' | 'category-menu' | 'profile-menu' | 'mobile-menu' | 'footer:tc' | 'footer:about';
export type ItemType = 'sref' | 'anchor' | 'modal' | 'href' | 'scroll' | 'title' | 'dropdown';
export type IMenuTarget = '_blank' | '_self' | '_parent' | '_top';
export type MenuTheme = string;

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
    counter?: ICounterType;
    type: ItemType;
    icon?: string;
    class?: string;
    wlcElement?: string;
    params?: IMenuItemParams;
    sort?: number,
}

export interface IMenuItemsGroup {
    parent: IMenuItem,
    counter?: ICounterType;
    items: IMenuItem[],
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
        };
        scrollToSelector?: string;
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
    wlcElementPrefix?: string;
    lang: string;
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
    sliderParams: {
        swiper: {
            direction: 'horizontal',
            slidesPerView: 'auto',
            spaceBetween: 10,
        },
    },
};
