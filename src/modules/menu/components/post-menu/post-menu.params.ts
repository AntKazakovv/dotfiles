import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export type ModifiersType = string;
export type Theme = 'default' | 'contacts' | 'footer';
export type ThemeMod = 'default' | 'footer-info' | 'footer-about';
export type Type = 'default';


export interface IBasePath {
    /** base path of url for each href */
    url: string;
    /** add current app lang to url link or not */
    addLanguage?: boolean;
    /** end part or url, subpage */
    page?: string;
}

export interface IPostMenuCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: ModifiersType[];
    common?: {
        /** category slug for find posts in wordpress */
        categorySlug?: string | string[];
        /** default state for menu items */
        defaultState?: string;
        /** exclude some wp posts by slugs */
        exclude?: string[];
        /** group menu items by each category slug */
        groupBySlag?: boolean;
        /** title for menu */
        title?: string;
        /** base path for href menu items */
        basePath?: IBasePath;
        /** use slider for mune items or not */
        useSlider?: boolean;
        /** Use slider arrows for menu or not */
        useSliderNavigation?: boolean;
    };
    /** css media breakpoints for use menu as html list */
    asListBp: string;
    /** base params for wlc-menu component */
    menuParams: MenuParams.IMenuCParams,
}

export const defaultParams: IPostMenuCParams = {
    class: 'wlc-post-menu',
    common: {
        useSlider: false,
        useSliderNavigation: false,
        groupBySlag: false,
        defaultState: 'app.contacts',
    },
    asListBp: '(max-width: 1023px)',
    menuParams: {
        type: 'post-menu',
        items: [],
        common: {
            useSwiper: false,
            swiper: {
                scrollToStart: false,
            },
            icons: {
                fallback: '',
            },
        },
        sliderParams: {
            swiper: {
                direction: 'horizontal',
                slidesPerView: 'auto',
                spaceBetween: 20,
                breakpoints: {
                    320: {
                        followFinger: false,
                    },
                    1024: {
                        followFinger: true,
                    },
                    1630: {
                        spaceBetween: 60,
                    },
                },
            },
        },
    },
};
