import * as Params from 'wlc-engine/modules/menu/components/menu/menu.params';

export const wlcAffiliatesMenuItemsGlobal: Params.IMenuItemsGlobal = {
    'affiliates-menu:why-us': {
        name: gettext('Why Us'),
        type: 'scroll',
        class: 'why-us',
        params: {
            scroll: '.description-block',
        },
    },
    'affiliates-menu:commission': {
        name: gettext('Commission'),
        type: 'scroll',
        class: 'commission',
        params: {
            scroll: '.commission-block',
        },
    },
    'affiliates-menu:faq': {
        name: gettext('FAQ'),
        type: 'scroll',
        class: 'faq',
        params: {
            scroll: '.wlc-sections__content-faq',
        },
    },
    'affiliates-menu:tc': {
        name: gettext('T&C'),
        type: 'modal',
        class: 'tc',
        params: {
            modal: {
                name: 'static.wlc-post',
                params: {
                    slug: 'terms_and_conditions',
                },
            },
        },
    },
};
