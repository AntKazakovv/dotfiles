import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export type ModifiersType = string;
export type Theme = 'default' | 'contacts' | 'footer';
export type ThemeMod = 'default' | 'footer-info' | 'footer-about';
export type Type = 'default';

export interface IPostDataMenu {
    name: string,
    slug: string,
    icon?: string,
}

export interface IBasePath {
    /** base path of url for each href */
    url?: string;
    /** add current app lang to url link or not */
    addLanguage?: boolean;
    /** end part or url, subpage */
    page?: string;
}

export interface IInfoPageMenuCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: ModifiersType[];
    /** category slug for find posts in wordpress */
    categorySlug: string | string[];
    /** default state for menu items */
    defaultState?: string;
    /** exclude some wp posts by slugs */
    exclude?: string[];
    /** title for menu */
    title?: string;
    /** base path for href menu items */
    basePath?: IBasePath;

    /** base params for wlc-menu component */
    menuParams: MenuParams.IMenuCParams,
    icons?: {
        folder?: string;
        use?: boolean;
    },
}

export const defaultParams: IInfoPageMenuCParams = {
    class: 'wlc-info-page-menu',
    defaultState: 'app.contacts',
    theme: 'default',
    categorySlug: 'legal',
    exclude: ['feedback'],
    basePath: {
        page: 'contacts',
        addLanguage: true,
    },
    menuParams: {
        type: 'info-page-menu',
        items: [],
        common: {
            icons: {
                fallback: '',
            },
        },
    },
};
