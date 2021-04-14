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
                icon: 'filter-merchants',
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
                icon: 'search',
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
                icon: 'search',
                event: {
                    name: 'SHOW_MODAL',
                    data: 'search',
                },
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
                icon: 'search',
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
                icon: 'burger',
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
                icon: 'user-icon',
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
                            icon: 'deposit-icon',
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
                            icon: 'user-icon',
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
                icon: 'login',
                event: {
                    name: 'SHOW_MODAL',
                    data: 'login',
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
