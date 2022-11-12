import {IMenuItemsGlobal} from 'wlc-engine/modules/menu/components/menu/menu.params';

export const wlcAffiliatesMenuItemsGlobal: IMenuItemsGlobal = {
    'affiliates-menu:why-us': {
        name: gettext('Why Us'),
        type: 'scroll',
        class: 'why-us',
        params: {
            scroll: '.wlc-sections__description-section',
        },
    },
    'affiliates-menu:commission': {
        name: gettext('Commission'),
        type: 'scroll',
        class: 'commission',
        params: {
            scroll: '.wlc-sections__commission-section',
        },
    },
    'affiliates-menu:faq': {
        name: gettext('FAQ'),
        type: 'scroll',
        class: 'faq',
        params: {
            scroll: '.wlc-sections__faq-section',
        },
    },
    'affiliates-menu:testimonials': {
        name: gettext('Testimonials'),
        type: 'scroll',
        class: 'testimonials',
        params: {
            scroll: '.wlc-sections__testimonials-section',
        },
    },
    'affiliates-menu:tc': {
        name: gettext('T&C'),
        type: 'modal',
        class: 'tc',
        params: {
            modal: {
                name: 'staticText',
                params: {
                    slug: 'partners-terms-and-conditions',
                    parseAsPlainHTML: true,
                },
            },
        },
    },
};
