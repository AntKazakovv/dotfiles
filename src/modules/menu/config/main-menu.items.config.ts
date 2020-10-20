import {IMenuItemsGlobal} from 'wlc-engine/modules/menu/components/menu/menu.interface';

export const wlcMainMenuItemsGlobal: IMenuItemsGlobal = {
    'main-menu:home': {
        name: gettext('Home page'),
        type: 'sref',
        class: 'home',
        params: {
            state: {
                name: 'app.home',
                params: {}
            }
        }
    },
    'main-menu:casino': {
        name: gettext('Casino'),
        type: 'sref',
        class: 'casino',
        params: {
            state: {
                name: 'app.catalog.casino',
                params: {category: ''}
            }
        }
    },
    'main-menu:live': {
        name: gettext('Live Casino'),
        type: 'sref',
        class: 'live',
        params: {
            state: {
                name: 'app.catalog.live',
                params: {category: ''}
            }
        }
    },
    'main-menu:promotions': {
        name: gettext('Promotions'),
        type: 'sref',
        class: 'promo',
        params: {
            state: {
                name: 'app.promotions',
                params: {}
            }
        }
    },
    'main-menu:contacts': {
        name: gettext('Contacts'),
        type: 'sref',
        class: 'contacts',
        params: {
            state: {
                name: 'app.contacts',
                params: {}
            }
        }
    }
};
