import {IIndexing} from 'wlc-engine/modules/core';

export type MenuItemType = 'category' | 'page' | 'dropdown';
export type MenuItemDevice = 'desktop' | 'mobile' | 'all';

export interface IMenu {
    mainMenu?: IMenuOptions;
    categoryMenu?: IMenuOptions;
    mobileMenu?: IMenuOptions;
    burgerMenu?: IMenuOptions;
    stickyFooter?: IMenuOptions;
    panelMenu?: IMenuOptions;
    panelMenuInfo?: IMenuOptions;
    infoPageMenu?: IMenuOptions;
}

export interface IMenuOptions {
    iconsPack?: string;
    items: IMenuItem[];
}

export interface IMenuItem {
    type: MenuItemType;
    id: string;
    order: number;
    device: MenuItemDevice;
    items?: IMenuItem[];
    name?: IIndexing<string>;
    iconUrl?: string;
}

export interface IPostDataOptions {
    categorySlug: string | string[],
    exclude?: string[],
}
