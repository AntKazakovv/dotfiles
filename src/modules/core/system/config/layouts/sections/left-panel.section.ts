import {IPanelSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace leftPanel {
    export const def: IPanelSectionConfig = {
        replaceConfig: true,
        theme: 'default',
        showHeader: false,
        showClose: false,
        display: {
            after: 1024,
        },
        useScroll: false,
        container: true,
        components: [
            {
                name: 'core.wlc-button',
                params: {
                    class: 'wlc-burger-panel__close',
                    wlcElement: 'wlc-btn-close',
                    common: {
                        iconPath: 'wlc/icons/close.svg',
                        event: {
                            name: 'PANEL_CLOSE',
                            data: 'left-def',
                        },
                    },
                },
            },
            componentLib.wlcMainMenu.burgerPanel,
            componentLib.wlcPostMenu.burgerPanelInfo,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-burger-panel__additional',
                    components: [
                        componentLib.wlcLanguageSelector.bottomLeft,
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                display: {
                    auth: true,
                },
                params: {
                    class: 'wlc-burger-panel__user-deposit',
                    components: [
                        {
                            name: 'core.wlc-link-block',
                            params: {
                                common: {
                                    useInteractiveText: true,
                                    useLinkButton: false,
                                },
                            },
                        },
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                display: {
                    auth: false,
                },
                params: {
                    class: 'wlc-burger-panel__user-deposit',
                    components: [
                        {
                            name: 'core.wlc-title',
                            params: {
                                mainText: gettext('Choose your special bonus!'),
                            },
                        },
                        componentLib.wlcButton.leftMenuSignup,
                    ],
                },
            },
            componentLib.wlcButton.searchDef,
        ],
    };

    export const defThemeToggler: IPanelSectionConfig = {
        replaceConfig: true,
        theme: 'default',
        showHeader: false,
        showClose: false,
        display: {
            after: 1024,
        },
        useScroll: false,
        container: true,
        components: [
            {
                name: 'core.wlc-button',
                params: {
                    class: 'wlc-burger-panel__close',
                    wlcElement: 'wlc-btn-close',
                    common: {
                        iconPath: 'wlc/icons/close.svg',
                        event: {
                            name: 'PANEL_CLOSE',
                            data: 'left-def',
                        },
                    },
                },
            },
            componentLib.wlcMainMenu.burgerPanel,
            componentLib.wlcPostMenu.burgerPanelInfo,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-burger-panel__additional',
                    components: [
                        componentLib.wlcLanguageSelector.bottomLeft,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-burger-panel__chat',
                            },
                        },
                        componentLib.wlcThemeToggler.def,
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                display: {
                    auth: true,
                },
                params: {
                    class: 'wlc-burger-panel__user-deposit',
                    components: [
                        {
                            name: 'core.wlc-link-block',
                            params: {
                                common: {
                                    useInteractiveText: true,
                                    useLinkButton: false,
                                },
                            },
                        },
                    ],
                },
            },
            {
                name: 'core.wlc-wrapper',
                display: {
                    auth: false,
                },
                params: {
                    class: 'wlc-burger-panel__user-deposit',
                    components: [
                        {
                            name: 'core.wlc-title',
                            params: {
                                mainText: gettext('Choose your special bonus!'),
                            },
                        },
                        componentLib.wlcButton.leftMenuSignup,
                    ],
                },
            },
            componentLib.wlcButton.searchDef,
        ],
    };

    export const left: IPanelSectionConfig = {
        replaceConfig: true,
        theme: 'left',
        display: {
            after: 1024,
        },
        components: [
            componentLib.wlcLogo.header,
            componentLib.wlcLoginSignup.burgerPanel,
            {
                name: 'core.wlc-wrapper',
                display: {
                    auth: true,
                },
                params: {
                    class: 'wlc-burger-panel__user-info',
                    components: [
                        componentLib.wlcUserName.def,
                        componentLib.wlcLogout.burgerPanelLeft,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-burger-panel__user-stat',
                                components: [
                                    componentLib.wlcUserStats.def,
                                    componentLib.wlcButton.toProfileV2,
                                ],
                            },
                        },
                    ],
                },
            },
            componentLib.wlcMainMenu.burgerPanelIcons,
            componentLib.wlcPostMenu.burgerPanelInfo,
            componentLib.wlcLanguageSelector.long,
            {
                name: 'core.wlc-wrapper',
                display: {
                    auth: true,
                },
                params: {
                    class: 'wlc-burger-panel__user-deposit',
                    components: [
                        {
                            name: 'core.wlc-link-block',
                            params: {
                                common: {
                                    useInteractiveText: true,
                                    useLinkButton: false,
                                },
                            },
                        },
                    ],
                },
            },
        ],
    };

    export const leftThemeToggler: IPanelSectionConfig = {
        replaceConfig: true,
        theme: 'left',
        modifiers: ['theme-toggler'],
        display: {
            after: 1024,
        },
        components: [
            ...left.components,
            componentLib.wlcThemeToggler.def,
        ],
    };

    export const option3: IPanelSectionConfig = {
        replaceConfig: true,
        theme: 'option3',
        display: {
            after: 1024,
        },
        components: [
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.burgerPanelIconsOption3,
            componentLib.wlcPostMenu.burgerPanelInfo,
            componentLib.wlcLanguageSelector.topLeftTheme2,
        ],
    };

    export const option3themeToggler: IPanelSectionConfig = {
        replaceConfig: true,
        theme: 'option3',
        modifiers: ['theme-toggler'],
        display: {
            after: 1024,
        },
        components: [
            ...option3.components,
            componentLib.wlcThemeToggler.def,
        ],
    };

    export const mobile: IPanelSectionConfig = {
        replaceConfig: true,
        theme: 'mobile',
        display: {
            before: 1023,
        },
        components: [
            componentLib.wlcLoginSignup.burgerPanel,
            componentLib.wlcMobileMenu.vertical,
            componentLib.wlcLanguageSelector.long,
        ],
    };

    export const mobileThemeToggler: IPanelSectionConfig = {
        replaceConfig: true,
        theme: 'mobile',
        modifiers: ['theme-toggler'],
        display: {
            before: 1023,
        },
        components: [
            ...mobile.components,
            componentLib.wlcThemeToggler.long,
        ],
    };
}
