'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';

export const profileCashState: Ng2StateDeclaration = {
    abstract: true,
    url: '/cash',
};

export const profileCashDepositState: Ng2StateDeclaration = {
    url: '',
};

export const profileCashWithdrawState: Ng2StateDeclaration = {
    url: '/withdraw',
};

export const profileCashWalletState: Ng2StateDeclaration = {
    url: '/wallet',
};

export const profileCashTransactionsState: Ng2StateDeclaration = {
    url: '/transactions',
};
