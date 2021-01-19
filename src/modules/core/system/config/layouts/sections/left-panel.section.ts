import {IPanelSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace leftPanel {
    export const def: IPanelSectionConfig = {
        components: [
            componentLib.wlcLoginSignup.panel,
            componentLib.wlcMobileMenu.vertical,
            componentLib.wlcLanguageSelector.long,
        ],
    };
}
