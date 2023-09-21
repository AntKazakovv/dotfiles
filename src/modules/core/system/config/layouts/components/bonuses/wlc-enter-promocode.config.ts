import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcEnterPromocode {
    export const def: ILayoutComponent = {
        name: 'bonuses.wlc-enter-promocode',
        display: {
            auth: true,
        },
    };

    export const hideTitle: ILayoutComponent = {
        name: 'bonuses.wlc-enter-promocode',
        display: {
            auth: true,
        },
        params: {
            theme: 'clear',
            common: {
                showTitle: false,
            },
        },
    };

    export const hideTitleV1: ILayoutComponent = {
        name: 'bonuses.wlc-enter-promocode',
        display: {
            auth: true,
            after: 560,
        },
        params: {
            theme: 'clear',
            common: {
                showTitle: false,
            },
        },
    };

    export const wolf: ILayoutComponent = {
        name: 'bonuses.wlc-enter-promocode',
        display: {
            auth: true,
        },
        params: {
            theme: 'wolf',
            common: {
                showDescription: true,
                description: gettext('Use the promo code and get a great bonus for it!'),
                placeholder: gettext('Promo code'),
                btnIconPath: '/wlc/icons/enter-send.svg',
            },
        },
    };
};
