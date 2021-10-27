import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcButton {
    export const searchMerchants: ILayoutComponent = {
        name: 'core.wlc-button',
        display: {
            after: 900,
        },
        params: {
            class: 'wlc-btn wlc-btn-merch',
            common: {
                iconPath: '/wlc/icons/filter-merchants.svg',
                text: 'All providers',
                event: {
                    name: 'SHOW_MODAL',
                    data: 'searchWithOpenedProviders',
                },
            },
        },
    };

    export const search: ILayoutComponent = {
        name: 'core.wlc-button',
        params: {
            class: 'wlc-btn wlc-btn-search',
            common: {
                iconPath: '/wlc/icons/search.svg',
                text: 'Search for games',
                event: {
                    name: 'SHOW_MODAL',
                    data: 'search',
                },
            },
        },
    };

    export const searchV2: ILayoutComponent = {
        name: 'core.wlc-button',
        display: {
            after: 1200,
        },
        params: {
            class: 'wlc-btn wlc-btn-search',
            wlcElement: 'wlc-btn-search',
            common: {
                iconPath: '/wlc/icons/search.svg',
                event: [
                    {
                        name: 'PANEL_CLOSE',
                    },
                    {
                        name: 'SHOW_MODAL',
                        data: 'search',
                    },
                ],
            },
        },
    };

    export const searchDef: ILayoutComponent = {
        name: 'core.wlc-button',
        display: {
            after: 900,
        },
        params: {
            class: 'wlc-btn wlc-btn-search',
            wlcElement: 'wlc-btn-search',
            common: {
                iconPath: '/wlc/icons/search.svg',
                event: [
                    {
                        name: 'PANEL_CLOSE',
                    },
                    {
                        name: 'SHOW_MODAL',
                        data: 'search',
                    },
                ],
            },
        },
    };

    export const searchV3: ILayoutComponent = {
        name: 'core.wlc-button',
        display: {
            after: 900,
        },
        params: {
            class: 'wlc-btn wlc-btn-search',
            common: {
                iconPath: '/wlc/icons/search.svg',
                text: 'Search for games',
                event: {
                    name: 'SHOW_MODAL',
                    data: 'search',
                },
            },
        },
    };

    export const burger: ILayoutComponent = {
        name: 'core.wlc-button',
        params: {
            class: 'wlc-btn wlc-btn-burger',
            wlcElement: 'wlc-btn-burger',
            common: {
                iconPath: '/wlc/icons/burger.svg',
                event: {
                    name: 'PANEL_OPEN',
                    data: 'left',
                },
            },
        },
    };

    export const burgerMobile: ILayoutComponent = {
        name: 'core.wlc-button',
        display: {
            before: 1365,
        },
        params: {
            class: 'wlc-btn wlc-btn-burger',
            wlcElement: 'wlc-btn-burger',
            common: {
                iconPath: '/wlc/icons/burger.svg',
                event: {
                    name: 'PANEL_OPEN',
                    data: 'left',
                },
            },
        },
    };

    export const userIcon: ILayoutComponent = {
        name: 'core.wlc-button',
        display: {
            auth: true,
            before: 1023,
        },
        params: {
            class: 'wlc-btn wlc-btn-user',
            common: {
                iconPath: '/wlc/icons/user-icon.svg',
                sref: 'app.profile.cash.deposit',
                event: {
                    name: 'PANEL_OPEN',
                    data: 'right',
                },
            },
        },
    };

    export const userDepositIcon: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        display: {
            auth: true,
            before: 1199,
        },
        params: {
            class: 'wlc-btn-user',
            components: [
                {
                    name: 'core.wlc-button',
                    params: {
                        class: 'wlc-btn wlc-btn--deposit',
                        theme: 'cleared',
                        common: {
                            iconPath: '/wlc/icons/deposit-icon.svg',
                            sref: 'app.profile.cash.deposit',
                        },
                    },
                },
                {
                    name: 'core.wlc-button',
                    class: 'wlc-btn ',
                    params: {
                        class: 'wlc-btn wlc-btn--user',
                        theme: 'cleared',
                        common: {
                            iconPath: '/wlc/icons/user-icon.svg',
                            event: {
                                name: 'PANEL_OPEN',
                                data: 'right',
                            },
                        },
                    },
                },
            ],
        },
    };

    export const login: ILayoutComponent = {
        name: 'core.wlc-button',
        display: {
            before: 1199,
            auth: false,
        },
        params: {
            class: 'wlc-btn wlc-btn-login',
            common: {
                iconPath: '/wlc/icons/login.svg',
                event: {
                    name: 'SHOW_MODAL',
                    data: 'login',
                },
            },
        },
    };

    export const mobileLoginBtn: ILayoutComponent = {
        name: 'core.wlc-button',
        display: {
            before: 1199,
            auth: false,
        },
        params: {
            themeMod: 'secondary',
            common: {
                customModifiers: 'mobile-login',
                text: gettext('Login'),
                event: {
                    name: 'SHOW_MODAL',
                    data: 'login',
                },
            },
        },
    };

    export const affLogin: ILayoutComponent = {
        name: 'core.wlc-button',
        display: {
            before: 1199,
        },
        params: {
            class: 'wlc-btn wlc-btn-login',
            common: {
                iconPath: '/wlc/icons/login.svg',
                event: {
                    name: 'AFFILIATE_LOGIN',
                },
            },
        },
    };

    export const deposit: ILayoutComponent = {
        name: 'core.wlc-button',
        params: {
            themeMod: 'deposit',
            common: {
                text: gettext('Deposit'),
                sref: 'app.profile.cash.deposit',
            },
        },
    };

    export const leftMenuDeposit: ILayoutComponent = {
        name: 'core.wlc-button',
        params: {
            customMod: 'deposit',
            themeMod: 'deposit',
            common: {
                text: gettext('Deposit'),
                sref: 'app.profile.cash.deposit',
            },
        },
    };

    export const leftMenuSignup: ILayoutComponent = {
        name: 'core.wlc-button',
        params: {
            common: {
                text: gettext('Register'),
                event: {
                    name: 'SHOW_MODAL',
                    data: 'signup',
                },
            },
        },
    };

    export const toProfile: ILayoutComponent = {
        name: 'core.wlc-button',
        display: {
            auth: true,
        },
        params: {
            themeMod: 'promotions',
            wlcElement: 'button_go-to-profile',
            common: {
                text: gettext('Go to Profile'),
                sref: 'app.profile.loyalty-bonuses.main',
            },
        },
    };

    export const toProfileV2: ILayoutComponent = {
        name: 'core.wlc-button',
        params: {
            class: 'wlc-btn',
            themeMod: 'secondary',
            common: {
                text: gettext('Profile'),
                sref: 'app.profile.dashboard',
            },
        },
    };

    export const totalJackpot: ILayoutComponent = {
        name: 'core.wlc-button',
        params: {
            common: {
                text: gettext('Play'),
                sref: 'app.catalog.child',
                srefParams: {
                    category: 'casino',
                    childCategory: 'jackpots',
                },
            },
            wlcElement: 'button-play',
        },
    };
}
