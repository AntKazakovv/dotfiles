import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {ISliderCParams} from 'wlc-engine/modules/promo';
import {TIconExtension} from 'wlc-engine/modules/menu/system/interfaces/menu.interface';
import {ICategoryMenuCParams} from 'wlc-engine/modules/menu/components/category-menu/category-menu.params';
import {IMenuOptions} from 'wlc-engine/modules/core/system/interfaces/menu.interface';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {ICounterCParams} from 'wlc-engine/modules/core/components/counter/counter.params';
import {Observable} from 'rxjs';

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
    | 'mobile-menu-main'
    | 'post-menu'
    | 'footer:tc'
    | 'footer:about'
    | 'affiliates-menu'
    | 'sticky-footer'
    | 'burger-panel-header-menu';
export type ItemType =
    | 'sref'
    | 'anchor'
    | 'modal'
    | 'href'
    | 'event'
    | 'scroll'
    | 'title'
    | 'dropdown'
    | 'group'
    | 'wordpress'
    | 'categories'
    | 'market'
    | 'action';
export type WpItemType = 'sref' | 'href';
export type IMenuTarget = '_blank' | '_self' | '_parent' | '_top';
export type MenuTheme = 'default' | 'submenu' | string;
export type TMenuItemDevice = 'mobile' | 'desktop' | 'all';
export type PanelType = 'left' | 'right';

/**
 * Settings for generate menu items by wordpress data
 */
export interface IMenuItemParamsWp {
    /** category slugs for find posts in wordpress */
    slug: string[];
    /** default state for menu items */
    defaultState: string;
    /** default type for menu items */
    defaultType: WpItemType;
    /** post slugs for excludes some posts */
    exclude?: string[];
}

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
    jwtToken?: boolean;
    baseSiteUrl?: boolean;
}

export interface IMenuItemParamsEvent {
    name: string,
    data?: unknown;
}

export interface IMenuItemParams {
    state?: IMenuItemParamsState;
    anchor?: IMenuItemParamsAnchor;
    scroll?: string;
    modal?: IMenuItemParamsModal;
    href?: string | IMenuItemParamsHref;
    target?: IMenuTarget;
    categories?: {
        componentParams: ICategoryMenuCParams;
    }
    blockExpand?: boolean;
    wp?: IMenuItemParamsWp;
    event?: IMenuItemParamsEvent;
    action?: IMenuItemParamsAction;
}

export interface IMenuItemParamsAction {
    emit: () => void;
    isActive?: Observable<boolean>;
}

export interface IMenuItem {
    name: string | IIndexing<string>;
    type: ItemType;
    /**
     * Params to counter component
     */
    counterParams?: ICounterCParams;
    icon?: string;
    iconPath?: string;
    iconUrl?: string;
    iconFallback?: string;
    class?: string;
    wlcElement?: string;
    params?: IMenuItemParams;
    device?: TMenuItemDevice;
    /**
     * Visibility by authentication:
     * true - for authorized user only,
     * false - for unauthorized user only,
     * undefined - always.
     */
    auth?: boolean | undefined;
    sort?: number;
    /** no translate item name */
    noTranslate?: boolean;
}

export interface IMenuItemsGroup {
    parent: IMenuItem,
    items: MenuItemObjectType[],
    type?: ItemType,
    /**
     * Params to counter component
     */
    counterParams?: ICounterCParams;
    expand?: boolean;
}

export interface IMenuDropdowns {
    /** force expand all menu dropdowns when specified states opened */
    expandByStates?: IStateForExpand[];
    /** expand menu dropdowns by click or by opened state */
    expandableOnClick: boolean;
}

export interface IStateForExpand {
    name: string;
    params?: IIndexing<string | number>;
}

export interface IMenuCParams extends IComponentParams<MenuTheme, MenuType, string> {
    sliderParams?: ISliderCParams,
    common?: {
        useSwiper?: boolean;
        swiper?: {
            scrollToStart: boolean;
        },
        /** Additional settings for menu items */
        icons?: {
            fallback?: string;
            extension?: TIconExtension;
            /** Arrow icons for menu items */
            arrows?: {
                use: boolean;
                /** icon path for inner links */
                innerLinks?: string;
                /** icon path for outer links */
                outerLinks?: string;
            }
        };
        scrollToSelector?: string;
    },
    items?: MenuItemType[];
    scrollDuration?: number;
    /** If true - dropdown menu is open by default */
    expandOnStart?: boolean;
    /** Menu dropdowns options */
    dropdowns?: IMenuDropdowns;
    useTooltip?: boolean;
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
    items: MenuItemType[];
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
            arrows: {
                use: false,
                innerLinks: '/mobile-app/icons/arrow.svg',
                outerLinks: '/mobile-app/icons/arrow-2.svg',
            },
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
    dropdowns: {
        expandableOnClick: true,
    },
};
