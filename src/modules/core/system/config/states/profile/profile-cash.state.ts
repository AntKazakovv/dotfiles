'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';

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

export const profileCashTransactionsState: Ng2StateDeclaration = {
    url: '/transactions',
};

export const profileCashTransferState: Ng2StateDeclaration = {
    url: '/transfer',
    resolve: [
        StateHelper.profileStateResolver('$base.profile.transfers.use'),
    ],
};
