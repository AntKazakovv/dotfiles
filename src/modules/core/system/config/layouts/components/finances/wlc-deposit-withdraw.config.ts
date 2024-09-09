import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcDepositWithdraw {
    export const deposit: ILayoutComponent = {
        name: 'finances.wlc-deposit-withdraw',
        params: {
            mode: 'deposit',
            wlcElement: 'block_profile-deposit',
        },
    };

    export const depositSecond: ILayoutComponent = {
        name: 'finances.wlc-deposit-withdraw',
        params: {
            mode: 'deposit',
            wlcElement: 'block_profile-deposit',
            theme: 'second',
        },
    };

    export const pigCashierDeposit: ILayoutComponent = {
        name: 'finances.wlc-piq-cashier',
        params: {
            mode: 'deposit',
            wlcElement: 'block_profile-deposit',
        },
    };

    export const pigCashierWithdraw: ILayoutComponent = {
        name: 'finances.wlc-piq-cashier',
        params: {
            mode: 'withdraw',
            wlcElement: 'block_profile-withdraw',
        },
    };

    export const withdraw: ILayoutComponent = {
        name: 'finances.wlc-deposit-withdraw',
        params: {
            mode: 'withdraw',
            wlcElement: 'block_profile-withdraw',
        },
    };

    export const balanceAdaptive: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-user-stats-wrapper',
            components: [
                {
                    name: 'core.wlc-wrapper',
                    display: {
                        before: 899,
                        after: 640,
                        isMultyWallet: false,
                    },
                    params: {
                        class: 'wlc-user-stats-wrapper__grid',
                        components: [
                            {
                                name: 'user.wlc-user-stats',
                                params: {
                                    useDepositBtn: false,
                                    fields: [
                                        'balance',
                                        'bonusBalance',
                                    ],
                                },
                            },
                            {
                                name: 'user.wlc-user-stats',
                                params: {
                                    useDepositBtn: false,
                                    fields: [
                                        'points',
                                        'level',
                                    ],
                                },
                            },
                        ],
                    },
                },
                {
                    name: 'core.wlc-wrapper',
                    display: {
                        before: 639,
                    },
                    params: {
                        components: [
                            {
                                name: 'user.wlc-user-stats',
                                params: {
                                    useDepositBtn: false,
                                },
                            },
                        ],
                    },
                },
            ],
        },
    };
};
