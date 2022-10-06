import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcStickyFooter {

/**
 * Default wlc-sticky-footer theme
 */
    export const def: ILayoutComponent = {
        name: 'menu.wlc-sticky-footer',
    };

/**
 * wlc-sticky-footer theme where active menu-item is highlighted with the circle decor
 */

    export const circled: ILayoutComponent = {
        name: 'menu.wlc-sticky-footer',
        params: {
            theme: 'circled',
        },
    };

/**
 * wlc-sticky-footer theme with static circle decor in the middle
 */

    export const staticCircle: ILayoutComponent = {
        name: 'menu.wlc-sticky-footer',
        params: {
            theme: 'static-circle',
        },
    };
}
