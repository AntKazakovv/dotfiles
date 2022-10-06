import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace profileMenu {
    export const def: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcProfileMenu.def,
        ],
    };
}
