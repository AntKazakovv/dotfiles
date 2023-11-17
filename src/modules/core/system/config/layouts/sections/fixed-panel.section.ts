import {IPanelSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace fixedPanel {
    export const left: IPanelSectionConfig = {
        replaceConfig: true,
        theme: 'left',
        type: 'fixed',
        display: {
            after: 1024,
        },
        components: [
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
            componentLib.wlcMainMenu.fixedBurger,
            componentLib.wlcPostMenu.burgerPanelInfo,
            componentLib.wlcLanguageSelector.longCompact,
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

    export const leftThemeModWolf: IPanelSectionConfig = {
        replaceConfig: true,
        theme: 'left',
        type: 'fixed',
        themeMod: 'wolf',
        showLogo: true,
        display: {
            after: 1024,
        },
        components: [
            componentLib.wlcUserStats.wolfBurger,
            componentLib.wlcPanelMenu.fixedBurgerThemeWolf,
            componentLib.wlcPanelMenu.fixedBurgerInfoThemeWolf,
            componentLib.wlcLanguageSelector.menuThemeWolf,
            componentLib.wlcSocialIcons.menuThemeWolf,
        ],
    };

    export const leftThemeModWolfThemeToggler: IPanelSectionConfig = {
        replaceConfig: true,
        theme: 'left',
        type: 'fixed',
        themeMod: 'wolf',
        showLogo: true,
        display: {
            after: 1024,
        },
        components: [
            componentLib.wlcPanelMenu.fixedBurgerThemeWolf,
            componentLib.wlcPanelMenu.fixedBurgerInfoThemeWolf,
            componentLib.wlcLanguageSelector.menuThemeWolf,
            componentLib.wlcThemeToggler.themeModWolf,
            componentLib.wlcSocialIcons.menuThemeWolf,
        ],
    };

    export const rightChat: IPanelSectionConfig = {
        replaceConfig: true,
        theme: 'right',
        type: 'fixed',
        showHeader: false,
        showClose: false,
        useScroll: false,
        components: [
            {
                name: 'chat.wlc-chat-panel',
            },
        ],
    };
}
