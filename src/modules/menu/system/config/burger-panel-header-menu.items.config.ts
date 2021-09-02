import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export const wlcBurgerPanelHeaderMenuItemsGlobal: MenuParams.IMenuItemsGlobal = {
    'burger-panel-header-menu:lobby': {
        name: '',
        type: 'sref',
        icon: 'lobby',
        class: 'lobby',
        params: {
            state: {
                name: 'app.home',
            },
        },
    },
    'burger-panel-header-menu:favourites': {
        name: '',
        type: 'sref',
        icon: 'favourites',
        class: 'favourites',
        params: {
            state: {
                name: 'app.catalog',
                params: {
                    category: 'favourites',
                },
            },
        },
        auth: true,
    },
    'burger-panel-header-menu:lastplayed': {
        name: '',
        type: 'sref',
        icon: 'last-played',
        class: 'last-played',
        params: {
            state: {
                name: 'app.catalog',
                params: {
                    category: 'lastplayed',
                },
            },
        },
        auth: true,
    },
};
