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
            componentLib.wlcPostMenu.footerFirst,
            componentLib.wlcLogo.footerFirst,
            componentLib.wlcSocialIcons.compact,
            componentLib.wlcLicense.def,
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
            componentLib.wlcLanguageSelector.footerThemeFirst,
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
                        componentLib.wlcLanguageSelector.topLeftTheme2,
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                display: {
                    before: 899,
                },
                params: {
                    class: 'footer-language-selector',
                    components: [
                        componentLib.wlcLanguageSelector.footerThemeFirst,
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'footer-bottom',
                    id: 1,
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'footer-bottom__left',
                                components: [
                                    componentLib.wlcSocialIcons.def,
                                    componentLib.wlcLicense.onlyDesktop,
                                ],
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'footer-bottom__right',
                                components: [
                                    componentLib.wlcDisclaimer.def,
                                    componentLib.wlcCopyright.def,
                                ],
                            },
                        },
                        componentLib.wlcLicense.onlyMobile,
                    ],
                },
            },
        ],
    };
}
