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
        title: gettext('Reality checker'),
        value: 'realityChecker',
    },
    timeOut: {
        title: gettext('Time out'),
        value: 'timeOut',
    },
};
