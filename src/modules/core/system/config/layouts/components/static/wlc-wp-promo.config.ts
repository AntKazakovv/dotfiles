import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcWpPromo {
    export const def: ILayoutComponent = {
        name: 'static.wlc-wp-promo',
    };
    export const defUntitled: ILayoutComponent = {
        name: 'static.wlc-wp-promo',
        params: {
            titleComponentParams: {
                mainText: '',
            },
        },
    };
    export const defBanner: ILayoutComponent = {
        name: 'static.wlc-wp-promo',
        params: {
            categorySlug: 'promotion_posts-banner',
            themeMod: 'banner',
            titleComponentParams: {
                mainText: '',
            },
        },
    };
}
