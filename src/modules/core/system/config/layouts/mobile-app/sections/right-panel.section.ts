import {IPanelSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace rightPanel {
    export const def: IPanelSectionConfig = {
        theme: 'mobile',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-user-info__wrp',
                    components: [
                        componentLib.wlcUserName.def,
                        componentLib.wlcLogout.def,
                    ],
                },
                display: {
                    auth: true,
                },
            },
            componentLib.wlcUserStats.def,
            componentLib.wlcProfileMenu.vertical,
        ],
    };

    export const kiosk: IPanelSectionConfig = {
        theme: 'mobile',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-user-info__wrp',
                    components: [
                        componentLib.wlcUserName.def,
                        componentLib.wlcLogout.def,
                    ],
                },
            },
            componentLib.wlcUserStats.kiosk,
            componentLib.wlcProfileMenu.vertical,
        ],
    };
}
