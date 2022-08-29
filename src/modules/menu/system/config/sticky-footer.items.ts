import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import {commonMenuItems} from 'wlc-engine/modules/menu/system/config/common.items.config';

export const wlcStickyFooterItemsGlobal: MenuParams.IMenuItemsGlobal = {
    'sticky-footer:menu': {
        name: gettext('Menu'),
        type: 'event',
        class: 'menu',
        icon: 'menu',
        sort: 0,
        params: {
            event: {
                name: 'PANEL_OPEN',
                data: 'left',
            },
        },
        wlcElement: 'link_sticky-footer-nav-menu',
    },
    'sticky-footer:sports': {
        ...commonMenuItems.sportsbook,
        wlcElement: 'link_sticky-footer-nav-sports',
    },
    'sticky-footer:casino': {
        name: gettext('Casino'),
        type: 'sref',
        class: 'casino',
        icon: 'casino',
        sort: 0,
        params: {
            state: {
                name: 'app.catalog',
                params: {
                    category: 'casino',
                },
            },
            href: {
                url: '/catalog/casino/',
                baseSiteUrl: true,
            },
        },
        wlcElement: 'link_sticky-footer-nav-casino',
    },
    'sticky-footer:livecasino': {
        name: gettext('Live Casino'),
        type: 'sref',
        class: 'livecasino',
        icon: 'livecasino',
        sort: 0,
        params: {
            state: {
                name: 'app.catalog',
                params: {
                    category: 'livecasino',
                },
            },
            href: {
                url: '/catalog/livecasino',
                baseSiteUrl: true,
            },
        },
        wlcElement: 'link_sticky-footer-nav-livecasino',
    },
    'sticky-footer:deposit': {
        name: gettext('Deposit'),
        type: 'sref',
        class: 'deposit',
        icon: 'deposit',
        sort: 0,
        auth: true,
        params: {
            state: {
                name: 'app.profile.cash.deposit',
            },
            href: {
                url: '/',
                baseSiteUrl: true,
            },
        },
        wlcElement: 'link_sticky-footer-nav-deposit',
    },
    'sticky-footer:login': {
        name: gettext('Login'),
        type: 'event',
        class: 'login',
        icon: 'login',
        sort: 0,
        auth: false,
        params: {
            event: {
                name: 'SHOW_MODAL',
                data: 'login',
            },
        },
        wlcElement: 'link_sticky-footer-nav-login',
    },
    'sticky-footer:signup': {
        name: gettext('Sign up'),
        type: 'event',
        class: 'signup',
        icon: 'signup',
        sort: 0,
        auth: false,
        params: {
            event: {
                name: 'SHOW_MODAL',
                data: 'signup',
            },
        },
        wlcElement: 'link_sticky-footer-nav-signup',
    },
    'sticky-footer:profile': {
        name: gettext('Profile'),
        type: 'event',
        class: 'profile',
        icon: 'profile',
        sort: 0,
        auth: true,
        params: {
            event: {
                name: 'PANEL_OPEN',
                data: 'right',
            },
        },
        wlcElement: 'link_sticky-footer-nav-profile',
    },
};
