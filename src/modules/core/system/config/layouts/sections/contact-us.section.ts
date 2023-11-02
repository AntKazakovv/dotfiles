import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace contactUs {
    export const contactUs: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcContactUs.def,
        ],
    };
}
