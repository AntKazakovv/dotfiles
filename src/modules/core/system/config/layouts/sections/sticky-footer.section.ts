import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

/**
 *
 * Adds section with wlc-sticky-footer feature.
 * There are two extra wlc-sticky-footer themes available:
 *
 * 1. circled theme
 * componentLib.wlcStickyFooter.circled
 *
 * 2. static circle theme
 * componentLib.wlcStickyFooter.staticCircle
 *
 */

export namespace stickyFooter {
    export const def: ILayoutSectionConfig = {
        replaceConfig: true,
        theme: 'default',
        order: 1000,
        display: {
            before: 1023,
        },
        components: [
            componentLib.wlcStickyFooter.def,
        ],
    };
}
