import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcDepositWithdraw {
    export const deposit: ILayoutComponent = {
        name: 'finances.wlc-deposit-withdraw',
        params: {
            mode: 'deposit',
        },
    };

    export const withdraw: ILayoutComponent = {
        name: 'finances.wlc-deposit-withdraw',
        params: {
            mode: 'withdraw',
        },
    };

    export const submenu: ILayoutComponent = {
        name: 'menu.wlc-menu',
        display: {
            before: 899,
        },
        params: {
            themeMod: 'underline',
            items: [
                'profile-menu:cash-deposit',
                'profile-menu:cash-withdrawal',
            ],
        },
    };

    export const balance: ILayoutComponent = {
        name: 'user.wlc-user-stats',
        display: {
            before: 899,
        },
        params: {
            useDepositBtn: false,
        },
    };
};
