import * as Params from 'wlc-engine/modules/menu/components/menu/menu.params';
import {wlcMainMenuItemsGlobal} from './main-menu.items.config';
import {wlcCategoryMenuItemsGlobal} from './category-menu.config';
import {
    wlcMobileMenuItemsGlobal,
    wlcMobileMenuItemGroupsGlobal,
} from './mobile-menu.config';
import {wlcAffiliatesMenuItemsGlobal} from './affiliates-menu.items.config';
import {wlcProfileMenuItemsGlobal} from './profile-menu.config';
import {wlcBurgerPanelHeaderMenuItemsGlobal} from './burger-panel-header-menu.items.config';
import {wlcStickyFooterItemsGlobal} from 'wlc-engine/modules/menu/system/config/sticky-footer.items';

export const wlcMenuItemsGlobal: Params.IMenuItemsGlobal = {
    ...wlcMainMenuItemsGlobal,
    ...wlcCategoryMenuItemsGlobal,
    ...wlcMobileMenuItemsGlobal,
    ...wlcAffiliatesMenuItemsGlobal,
    ...wlcProfileMenuItemsGlobal,
    ...wlcBurgerPanelHeaderMenuItemsGlobal,
    ...wlcStickyFooterItemsGlobal,
};

export const wlcMenuItemGroupsGlobal: Params.IMenuItemGroupsGlobal = {
    ...wlcMobileMenuItemGroupsGlobal,
};
