import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace footer {
    export const def: ILayoutSectionConfig = {
        order: 1000,
        container: true,
        theme: '2',
        wlcElement: 'section_footer',
        components: [
            componentLib.wlcIconList.merchants,
            componentLib.wlcIconList.payments,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'footer-menu',
                    wlcElement: 'block_footer-info',
                    components: [
                        componentLib.wlcPostMenu.footerInfo,
                        componentLib.wlcPostMenu.footerAbout,
                        componentLib.wlcLanguageSelector.topLeft,
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'footer-bottom',
                    id: 1,
                    components: [
                        componentLib.wlcDisclaimer.def,
                        componentLib.wlcCopyright.def,
                        componentLib.wlcLicense.def,
                    ],
                },
            },
        ],
    };
}

