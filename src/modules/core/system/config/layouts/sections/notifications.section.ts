import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace notificationsSection {
    export const def: ILayoutSectionConfig = {
        container: false,
        order: -1,
        display: {
            mobile: true,
        },
        components: [
            componentLib.wlcPwaNotification.def,
        ],
    };
}
