import {IMenuItemsGlobal} from 'wlc-engine/modules/menu/components/menu/menu.interface';

export const wlcAffiliatesMenuItemsGlobal: IMenuItemsGlobal = {
    'affiliates-menu:why-us': {
        name: gettext('Why Us'),
        type: 'anchor',
        class: 'why-us',
        params: {
            anchor: {
                name: 'why-us'
            }
        }
    },
    'affiliates-menu:commission': {
        name: gettext('Commission'),
        type: 'anchor',
        class: 'commission',
        params: {
            anchor: {
                name: 'commission'
            }
        }
    },
    'affiliates-menu:faq': {
        name: gettext('FAQ'),
        type: 'anchor',
        class: 'faq',
        params: {
            anchor: {
                name: 'faq'
            }
        }
    },
    'affiliates-menu:tc': {
        name: gettext('T&C'),
        type: 'modal',
        class: 'tc',
        params: {
            modal: {
                name: 'static-text',
                params: {
                    slug: 'terms_and_conditions'
                }
            }
        }
    }
};
