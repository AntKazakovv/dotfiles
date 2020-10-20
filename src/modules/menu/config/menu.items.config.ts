import {IMenuItemsGlobal} from 'wlc-engine/modules/menu/components/menu/menu.interface';
import {wlcMainMenuItemsGlobal} from './main-menu.items.config';
import {wlcAffiliatesMenuItemsGlobal} from './affiliates-menu.items.config';

export const wlcDefaultMenuItems = {
    'main-menu': [
        'main-menu:home',
        'main-menu:casino',
        'main-menu:live',
        'main-menu:promotions',
        'main-menu:contacts',
    ],
    'affiliates-menu': [
        'affiliates-menu:why-us',
        'affiliates-menu:commission',
        'affiliates-menu:faq',
        'affiliates-menu:tc',
    ],
    'categories-menu': [],
    'profile-menu': [],
    'footer-menu:tc': [],
    'footer-menu:about-us': [],
};

export const wlcMenuItemsGlobal: IMenuItemsGlobal = {
    ...wlcMainMenuItemsGlobal,
    ...wlcAffiliatesMenuItemsGlobal
};
