import {TIndexingLimitTypeItems} from 'wlc-engine/modules/user/submodules/limitations';

export const limitType: TIndexingLimitTypeItems = {
    MaxDepositSum: {
        title: gettext('Deposit limit'),
        value: 'MaxDepositSum',
    },
    MaxBetSum: {
        title: gettext('Wager limit'),
        value: 'MaxBetSum',
    },
    MaxLossSum: {
        title: gettext('Loss limit'),
        value: 'MaxLossSum',
    },
    realityChecker: {
        title: gettext('Activity checker'),
        value: 'realityChecker',
    },
    timeOut: {
        title: gettext('Time out'),
        value: 'timeOut',
    },
    selfExclusion: {
        title: gettext('Self exclusion'),
        value: 'selfExclusion',
    },
    accountClosure: {
        title: gettext('Account closure'),
        value: 'accountClosure',
    },
};
