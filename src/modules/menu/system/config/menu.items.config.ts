import * as Params from 'wlc-engine/modules/menu/components/menu/menu.params';
import {wlcMainMenuItemsGlobal} from './main-menu.items.config';
import {wlcCategoryMenuItemsGlobal} from './category-menu.config';
import {
    wlcMobileMenuItemsGlobal,
    wlcMobileMenuItemGroupsGlobal,
} from './mobile-menu.config';
import {wlcProfileMenuItemsGlobal} from './profile-menu.config';
import {wlcBurgerPanelHeaderMenuItemsGlobal} from './burger-panel-header-menu.items.config';
import {wlcStickyFooterItemsGlobal} from 'wlc-engine/modules/menu/system/config/sticky-footer.items';
import {wlcMobileFooterMenuItemsGlobal} from 'wlc-engine/modules/menu/system/config/mobile-footer-menu.config';
import {wlcAffiliatesMenuItemsGlobal} from 'wlc-engine/modules/affiliates';
import {
    wlcPanelMenuItemGroupsGlobal,
    wlcPanelMenuItemsGlobal,
} from 'wlc-engine/modules/menu/system/config/panel-menu.config';

export const wlcMenuItemsGlobal: Params.IMenuItemsGlobal = {
    ...wlcMainMenuItemsGlobal,
    ...wlcCategoryMenuItemsGlobal,
    ...wlcMobileMenuItemsGlobal,
    ...wlcAffiliatesMenuItemsGlobal,
    ...wlcProfileMenuItemsGlobal,
    ...wlcBurgerPanelHeaderMenuItemsGlobal,
    ...wlcStickyFooterItemsGlobal,
    ...wlcMobileFooterMenuItemsGlobal,
    ...wlcPanelMenuItemsGlobal,
};

export const wlcMenuItemGroupsGlobal: Params.IMenuItemGroupsGlobal = {
    ...wlcMobileMenuItemGroupsGlobal,
    ...wlcPanelMenuItemGroupsGlobal,
};
