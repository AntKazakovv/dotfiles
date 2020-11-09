import {IComponentParams} from 'wlc-engine/interfaces/config.interface';

type MenuItemType = string | IMenuItem;
type MenuType = 'main' | 'categories' | 'profile' | 'footer:tc' | 'footer:about';
type ItemType = 'sref' | 'anchor' | 'modal';
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
    modal?: IMenuItemParamsModal;
}

interface IMenuItem {
    name: string;
    type: ItemType;
    icon?: string;
    class?: string;
    params?: IMenuItemParams;
}

interface IMenuParams extends IComponentParams<MenuTheme, MenuType, string> {
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
    IMenuParams,
    IMenuItemsGlobal,
    IHelperGetItemsParams,
};
