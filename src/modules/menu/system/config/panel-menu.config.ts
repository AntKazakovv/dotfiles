import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import {commonMenuItems} from 'wlc-engine/modules/menu/system/config/common.items.config';

export const wlcPanelMenuItemsGlobal: MenuParams.IMenuItemsGlobal = {
    'panel-menu:home': {
        name: gettext('Main page'),
        type: 'sref',
        class: 'home',
        icon: 'home',
        params: {
            state: {
                name: 'app.home',
                params: {},
            },
            href: {
                url: '/',
                baseSiteUrl: true,
            },
        },
    },
    'panel-menu:sportsbook': commonMenuItems.sportsbook,
    'panel-menu:promotions': commonMenuItems.promotions,
    'panel-menu:tournaments': commonMenuItems.tournaments,
    'panel-menu:favourites': commonMenuItems.favourites,
    'panel-menu:lastplayed': commonMenuItems.lastplayed,
    'panel-menu:contacts': {
        name: gettext('Contact us'),
        type: 'sref',
        class: 'contacts',
        icon: 'contact-us',
        params: {
            state: {
                name: 'app.contacts',
                params: {
                    slug: 'feedback',
                },
            },
            href: {
                url: '/contacts/feedback/',
                baseSiteUrl: true,
            },
        },
        wlcElement: 'link_main-nav-contuctus',
    },
    'panel-menu:contact-us': {
        name: gettext('Contact us'),
        type: 'sref',
        class: 'contacts',
        icon: 'contact-us',
        params: {
            state: {
                name: 'app.contact-us',
            },
            href: {
                url: '/contact-us',
                baseSiteUrl: true,
            },
        },
        wlcElement: 'link_main-nav-contuctus',
    },
    'panel-menu:info': {
        name: gettext('Information'),
        type: 'wordpress',
        params: {
            wp: {
                slug: ['legal'],
                exclude: ['feedback', 'contacts'],
                defaultState: 'app.contacts',
                defaultType: 'sref',
                disableTooltip: true,
                iconFolder: 'wlc/icons/european/v3',
                parentAsLink: true,
            },
        },
        icon: 'info',
        class: 'info',
    },
    'panel-menu:categories': {
        name: '',
        type: 'categories',
        params: {},
    },
};

export const wlcPanelMenuItemGroupsGlobal: MenuParams.IMenuItemGroupsGlobal = {
    'panel-menu:info': {
        type: 'group',
        parent: 'panel-menu:info',
        items: [],
    },
};
