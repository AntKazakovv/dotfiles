import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export const wlcInfoPageMenuItemsGlobal: MenuParams.IMenuItemsGlobal = {
    'info-page-menu:legal': {
        name: '',
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
};

export const wlcInfoPageMenuItemsGroupsGlobal: MenuParams.IMenuItemGroupsGlobal = {
    'info-page-menu:legal': {
        type: 'wordpress',
        parent: 'info-page-menu:legal',
        items: [],
    },
};
