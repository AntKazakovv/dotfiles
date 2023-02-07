import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';

export namespace header {

    export const def: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: 'mobile-app',
        container: false,
        components: [
            {
                name: 'mobile.wlc-mobile-header',
                params: {
                },
            },
        ],
    };

    export const profileMainInfo: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: 'mobile-app',
        container: false,
        components: [
            {
                name: 'mobile.wlc-mobile-header',
                params: {
                    themeMod: 'profile-main-info',
                    actionButton: {
                        icon: 'mobile-app/icons/setting.svg',
                        showModal: 'profileBlocks',
                    },
                },
            },
        ],
    };

    export const runGamePage: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: 'mobile-app',
        container: false,
        components: [
            {
                name: 'mobile.wlc-mobile-header',
                params: {
                    actionButton: {
                        component: {
                            class: 'wlc-favourite-icon',
                            components: [
                                {
                                    name: 'games.wlc-favourite-button',
                                    params: {
                                        theme: 'mobile-app',
                                        icon: '/mobile-app/icons/star.svg',
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        ],
    };

    export const languagePage: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: 'mobile-app',
        container: false,
        components: [
            {
                name: 'mobile.wlc-mobile-header',
                params: {
                    backButton: {
                        returnTo: {
                            state: 'app.menu',
                        },
                    },
                },
            },
        ],
    };

    export const profileHistoryPages: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: 'mobile-app',
        container: false,
        components: [
            {
                name: 'mobile.wlc-mobile-header',
                params: {
                    backButton: {
                        returnTo: {
                            state: 'app.menu.item',
                            params: {
                                item: 'history',
                            },
                        },
                    },
                },
            },
        ],
    };

    export const transactionsHistory: ILayoutSectionConfig = _merge(_cloneDeep(profileHistoryPages), {
        components: [
            {
                params: {
                    actionButton: {
                        component: {
                            components: [
                                componentLib.wlcHistoryFilter.transactions,
                            ],
                        },
                    },
                },
            },
        ],
    });

    export const bonusesHistory: ILayoutSectionConfig = _merge(_cloneDeep(profileHistoryPages), {
        components: [
            {
                params: {
                    actionButton: {
                        component: {
                            components: [
                                componentLib.wlcHistoryFilter.bonuses,
                            ],
                        },
                    },
                },
            },
        ],
    });

    export const tournamentsHistory: ILayoutSectionConfig = _merge(_cloneDeep(profileHistoryPages), {
        components: [
            {
                params: {
                    actionButton: {
                        component: {
                            components: [
                                componentLib.wlcHistoryFilter.tournaments,
                            ],
                        },
                    },
                },
            },
        ],
    });

    export const betsHistory: ILayoutSectionConfig = _merge(_cloneDeep(profileHistoryPages), {
        components: [
            {
                params: {
                    actionButton: {
                        component: {
                            components: [
                                componentLib.wlcHistoryFilter.bets,
                            ],
                        },
                    },
                },
            },
        ],
    });

    export const returnToSidebar: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: 'mobile-app',
        container: false,
        components: [
            {
                name: 'mobile.wlc-mobile-header',
                params: {
                    backButton: {
                        returnTo: {
                            state: 'app.menu',
                        },
                    },
                },
            },
        ],
    };

    export const returnToHome: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: 'mobile-app',
        container: false,
        components: [
            {
                name: 'mobile.wlc-mobile-header',
                params: {
                    backButton: {
                        returnTo: {
                            state: 'app.home',
                        },
                    },
                },
            },
        ],
    };

    export const providersItem: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: 'mobile-app',
        container: false,
        components: [
            {
                name: 'mobile.wlc-mobile-header',
                params: {
                    backButton: {
                        returnTo: {
                            state: 'app.providers',
                        },
                    },
                },
            },
        ],
    };

    export const providersItemCategory: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: 'mobile-app',
        container: false,
        components: [
            {
                name: 'mobile.wlc-mobile-header',
                params: {
                    backButton: {
                        returnTo: {
                            state: 'app.providers.item',
                        },
                    },
                },
            },
        ],
    };

    export const defSite: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '1',
        container: true,
        components: [
            componentLib.wlcButton.burger,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcUserInfo.header,
            componentLib.wlcButton.userDepositIcon,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.signup,
        ],
    };

    export const defThemeToggler: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '1',
        modifiers: ['theme-toggler'],
        container: true,
        components: [
            componentLib.wlcButton.burger,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcUserInfo.header,
            componentLib.wlcButton.userDepositIcon,
            componentLib.wlcThemeToggler.vertical,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.signup,
        ],
    };

    export const theme2: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '2',
        container: true,
        components: [
            componentLib.wlcButton.burger,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcUserInfo.header,
            componentLib.wlcButton.userDepositIcon,
            componentLib.wlcLanguageSelector.bottomLeft2,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.signup,
        ],
    };

    export const theme2WithMobileLoginBtn: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '2',
        modifiers: ['with-login-btn'],
        container: true,
        components: [
            componentLib.wlcButton.burger,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcUserInfo.header,
            componentLib.wlcButton.userDepositIcon,
            componentLib.wlcLanguageSelector.bottomLeft2,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.mobileLoginBtn,
        ],
    };

    export const theme2themeToggler: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '2',
        modifiers: ['theme-toggler'],
        container: true,
        components: [
            componentLib.wlcButton.burger,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcUserInfo.header,
            componentLib.wlcButton.userDepositIcon,
            componentLib.wlcLanguageSelector.bottomLeft2,
            componentLib.wlcThemeToggler.vertical,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.signup,
        ],
    };

    export const theme2withoutBurger: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '2',
        modifiers: ['without-burger'],
        container: true,
        components: [
            componentLib.wlcButton.burgerMobile,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcUserInfo.header,
            componentLib.wlcButton.userDepositIcon,
            componentLib.wlcLanguageSelector.bottomLeft2,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.signup,
        ],
    };

    export const theme2withoutBurgerThemeToggler: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '2',
        modifiers: ['without-burger', 'theme-toggler'],
        container: true,
        components: [
            componentLib.wlcButton.burgerMobile,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcUserInfo.header,
            componentLib.wlcButton.userDepositIcon,
            componentLib.wlcLanguageSelector.bottomLeft2,
            componentLib.wlcThemeToggler.vertical,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.signup,
        ],
    };

    export const aff: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '1',
        container: true,
        components: [
            componentLib.wlcButton.burger,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcLoginSignup.header,
            componentLib.wlcButton.affLogin,
        ],
    };

    export const kiosk: ILayoutSectionConfig = {
        replaceConfig: true,
        order: 0,
        theme: '1',
        modifiers: ['kiosk'],
        container: true,
        components: [
            componentLib.wlcButton.burgerMobile,
            componentLib.wlcLogo.header,
            componentLib.wlcMainMenu.header,
            componentLib.wlcButton.kioskLogin,
            componentLib.wlcUserInfo.header,
            componentLib.wlcButton.userIconKiosk,
            componentLib.wlcLanguageSelector.bottomLeft2,
            componentLib.wlcButton.searchV2,
            componentLib.wlcButton.mobileKioskLogin,
        ],
    };
}
