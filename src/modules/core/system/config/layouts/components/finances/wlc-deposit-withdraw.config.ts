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
}
