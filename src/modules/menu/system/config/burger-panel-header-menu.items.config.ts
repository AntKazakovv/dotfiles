import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import {commonMenuItems} from 'wlc-engine/modules/menu/system/config/common.items.config';

export const wlcBurgerPanelHeaderMenuItemsGlobal: MenuParams.IMenuItemsGlobal = {
    'burger-panel-header-menu:lobby': {
        ...commonMenuItems.lobby,
        name: '',
    },
    'burger-panel-header-menu:favourites': {
        ...commonMenuItems.favourites,
        name: '',
    },
    'burger-panel-header-menu:lastplayed': {
        ...commonMenuItems.lastplayed,
        name: '',
    },
};
