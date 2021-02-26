import {IPanelSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace rightPanel {
    export const def: IPanelSectionConfig = {
        components: [
            componentLib.wlcUserName.def,
            componentLib.wlcUserStats.def,
            componentLib.wlcProfileMenu.vertical,
        ],
    };
}
