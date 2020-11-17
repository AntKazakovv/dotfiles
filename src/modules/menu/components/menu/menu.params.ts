import {IComponentParams} from 'wlc-engine/interfaces/config.interface';

type MenuItemType = string | IMenuItem;
type MenuType = 'main-menu' | 'categories' | 'profile' | 'footer:tc' | 'footer:about';
type ItemType = 'sref' | 'anchor' | 'modal' | 'href' | 'scroll';
type IMenuTarget = '_blank' | '_self' | '_parent' | '_top';
export type MenuTheme = string;

interface IMenuItemParamsState {
    name: string;
    params?: {
        [key: string]: any;
    };
    options?: {
        [key: string]: any;
    };
}

interface IMenuItemParamsAnchor {
    name: string;
}

interface IMenuItemParamsModal {
    name: string;
    params?: any;
}

interface IMenuItemParams {
    state?: IMenuItemParamsState;
    anchor?: IMenuItemParamsAnchor;
    scroll?: string;
    modal?: IMenuItemParamsModal;
    href?: string;
    target?: IMenuTarget;
}

interface IMenuItem {
    name: string;
    type: ItemType;
    icon?: string;
    class?: string;
    params?: IMenuItemParams;
}

interface IMenuCParams extends IComponentParams<MenuTheme, MenuType, string> {
    common?: {},
    items?: MenuItemType[];
}

interface IMenuItemsGlobal {
    [key: string]: IMenuItem;
}

interface IHelperGetItemsParams {
    items?: MenuItemType[];
    type?: MenuType;
}

export {
    MenuItemType,
    MenuType,
    ItemType,
    IMenuItemParamsState,
    IMenuItemParams,
    IMenuItem,
    IMenuCParams,
    IMenuItemsGlobal,
    IHelperGetItemsParams,
    IMenuItemParamsModal,
};

export const defaultParams: IMenuCParams = {
    class: 'wlc-menu',
};
