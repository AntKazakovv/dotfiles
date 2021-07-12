import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export const wlcCategoryMenuItemsGlobal: MenuParams.IMenuItemsGlobal = {
    'category-menu:lobby': {
        name: gettext('Lobby'),
        type: 'sref',
        class: 'lobby',
        icon: 'lobby',
        sort: 0,
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
        wlcElement: 'link_category-nav-lobby',
    },
};
