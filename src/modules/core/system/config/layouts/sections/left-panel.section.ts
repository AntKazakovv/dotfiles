import {IPanelSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace leftPanel {
    export const def: IPanelSectionConfig = {
        theme: 'default',
        showHeader: false,
        display: {
            after: 900,
        },
        useScroll: false,
        container: true,
        components: [
            componentLib.wlcMainMenu.burgerPanel,
            componentLib.wlcPostMenu.burgerPanelInfo,
            componentLib.wlcLanguageSelector.topLeftTheme2,
            {
                name: 'core.wlc-wrapper',
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
