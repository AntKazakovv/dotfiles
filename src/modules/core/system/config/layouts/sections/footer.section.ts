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
            {
                name: 'core.wlc-icon-payments-list',
                params: {
                    iconsType: 'black',
                },
            },
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
                        componentLib.wlcRecaptchaPolicy.def,
                        componentLib.wlcCopyright.def,
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-footer-lang',
                    components: [
                        componentLib.wlcLanguageSelector.footerThemeFirst,
                    ],
                },
            },
            componentLib.wlcScrollUp.def,
        ],
    };

    export const themeFirstWithAffLink: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 1000,
        container: true,
        theme: '1',
        modifiers: ['theme-with-aff'],
        wlcElement: 'section_footer',
        components: [
            componentLib.wlcIconList.merchants,
            componentLib.wlcIconList.payments,
            componentLib.wlcPostMenu.footerFirst,
            componentLib.wlcLogo.footerFirst,
            componentLib.wlcSocialIcons.compact,
            componentLib.wlcButton.affRedirectLink,
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
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-footer-lang',
                    components: [
                        componentLib.wlcLanguageSelector.footerThemeFirst,
                    ],
                },
            },
            componentLib.wlcScrollUp.def,
        ],
    };

    export const themeFirstThemeToggler: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 1000,
        container: true,
        theme: '1',
        modifiers: ['theme-toggler'],
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
                        componentLib.wlcRecaptchaPolicy.def,
                        componentLib.wlcCopyright.def,
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-footer-lang',
                    components: [
                        componentLib.wlcLanguageSelector.footerThemeFirst,
                        {
                            name: 'core.wlc-wrapper',
                            display: {
                                after: 768,
                            },
                            params: {
                                class: 'wlc-footer-theme-toggler',
                                components: [
                                    componentLib.wlcThemeToggler.def,
                                ],
                            },
                        },
                    ],
                },
            },
            componentLib.wlcScrollUp.def,
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
                                    componentLib.wlcRecaptchaPolicy.def,
                                    componentLib.wlcCopyright.def,
                                ],
                            },
                        },
                        componentLib.wlcLicense.onlyMobile,
                    ],
                },
            },
            componentLib.wlcScrollUp.def,
        ],
    };

    export const themeSecondWithAffLink: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 1000,
        container: true,
        theme: '2',
        modifiers: ['theme-with-aff'],
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
                params: {
                    class: 'footer-bottom',
                    id: 1,
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'footer-bottom__left',
                                components: [
                                    componentLib.wlcButton.affRedirectLink,
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
            componentLib.wlcScrollUp.def,
        ],
    };

    export const themeSecondThemeToggler: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 1000,
        container: true,
        theme: '2',
        modifiers: ['theme-toggler'],
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
                        {
                            name: 'core.wlc-wrapper',
                            display: {
                                after: 1024,
                            },
                            params: {
                                class: 'footer-theme-toggler',
                                wlcElement: 'block_footer-theme-toggler',
                                components: [
                                    componentLib.wlcThemeToggler.defCompact,
                                ],
                            },
                        },
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
                                    componentLib.wlcRecaptchaPolicy.def,
                                    componentLib.wlcCopyright.def,
                                ],
                            },
                        },
                        componentLib.wlcLicense.onlyMobile,
                    ],
                },
            },
            componentLib.wlcScrollUp.def,
        ],
    };
}
