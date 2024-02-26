import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import {commonMenuItems} from 'wlc-engine/modules/menu/system/config/common.items.config';

export const wlcCategoryMenuItemsGlobal: MenuParams.IMenuItemsGlobal = {
    'category-menu:lobby': {
        ...commonMenuItems.lobby,
        sort: 0,
        wlcElement: 'link_category-nav-lobby',
    },
    'category-menu:favourites': commonMenuItems.favourites,
    'category-menu:lastplayed': commonMenuItems.lastplayed,
};
