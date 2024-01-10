import {ILayoutComponent} from 'wlc-engine/modules/core';
export namespace wlcMultiWallet {
    export const userMultiWallet: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        display: {
            auth: true,
            before: 1199,
        },
        params: {
            class: 'wlc-multiWallet',
            components: [
                {
                    name: 'multi-wallet.wlc-wallets',
                    params: {
                        showDepositBtn: true,
                        depositBtnParams: {
                            customMod: 'deposit',
                            common: {
                                iconPath: '/wlc/icons/deposit-icon.svg',
                                sref: 'app.profile.cash.deposit',
                            },
                        },
                    },
                },
                {
                    name: 'user.wlc-user-icon',
                    display: {
                        auth: true,
                        before: 1199,
                    },
                    params: {
                        event: {
                            name: 'PANEL_OPEN',
                            data: 'right',
                        },
                        showAsBtn: true,
                    },
                },
            ],
        },
    };
}
