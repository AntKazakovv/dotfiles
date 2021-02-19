import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace footer {
    export const themeFirst: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 1000,
        container: true,
        theme: '1',
        wlcElement: 'section_footer',
        components: [
            componentLib.wlcIconList.merchants,
            componentLib.wlcIconList.payments,
            componentLib.wlcLogo.header,
            componentLib.wlcPostMenu.footerInfo,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-footer-menu',
                    wlcElement: 'block_footer-menu',
                    components: [
                        componentLib.wlcPostMenu.footerAbout,
                        componentLib.wlcLicense.def,
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-footer-disclaimer',
                    components: [
                        componentLib.wlcDisclaimer.def,
                        componentLib.wlcCopyright.def,
                    ],
                },
            },
            componentLib.wlcLanguageSelector.topLeft,
        ],
    };
    export const themeSecond: ILayoutSectionConfig = {
        replaceConfig: true,
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
                        componentLib.wlcLanguageSelector.topLeftTheme2,
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
