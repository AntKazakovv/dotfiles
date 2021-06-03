import {IPanelSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace leftPanel {
    export const def: IPanelSectionConfig = {
        theme: 'default',
        showHeader: false,
        showClose: false,
        display: {
            after: 900,
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
                        icon: 'close',
                        event: {
                            name: 'PANEL_CLOSE',
                            data: 'left-def',
                        },
                    },
                },
            },
            componentLib.wlcMainMenu.burgerPanel,
            componentLib.wlcPostMenu.burgerPanelInfo,
            componentLib.wlcLanguageSelector.bottomLeft,
            {
                name: 'core.wlc-wrapper',
                display: {
                    auth: true,
                },
                params: {
                    class: 'wlc-burger-panel__user-deposit',
                    components: [
                        {
                            name: 'core.wlc-title',
                            params: {
                                mainText: gettext('Do you want to top up your balance?'),
                            },
                        },
                        componentLib.wlcButton.leftMenuDeposit,
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
            componentLib.wlcButton.searchV2,
        ],
    };

    export const left: IPanelSectionConfig = {
        theme: 'left',
        display: {
            after: 900,
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
                            name: 'core.wlc-title',
                            params: {
                                mainText: gettext('Do you want to top up your balance?'),
                            },
                        },
                        componentLib.wlcButton.deposit,
                    ],
                },
            },
        ],
    };

    export const mobile: IPanelSectionConfig = {
        theme: 'mobile',
        display: {
            before: 899,
        },
        components: [
            componentLib.wlcLoginSignup.burgerPanel,
            componentLib.wlcMobileMenu.vertical,
            componentLib.wlcLanguageSelector.long,
        ],
    };
}
