import {IIndexing} from 'wlc-engine/modules/core';
import {
    TIndexingLimitTypeItems,
} from 'wlc-engine/modules/user/submodules/limitations/system/interfaces/limitations.interface';

export namespace profileLimitations {

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
}

export const limitTypeTexts: IIndexing<string> = {
    'MaxDepositSumDay': gettext('Daily deposit limit'),
    'MaxBetSumDay': gettext('Daily bet limit'),
    'MaxLossSumDay': gettext('Daily lost limit'),
    'MaxDepositSumWeek': gettext('Weekly deposit limit'),
    'MaxBetSumWeek': gettext('Weekly bet limit'),
    'MaxLossSumWeek': gettext('Weekly lost limit'),
    'MaxDepositSumMonth': gettext('Monthly deposit limit'),
    'MaxBetSumMonth': gettext('Monthly bet limit'),
    'MaxLossSumMonth': gettext('Monthly lost limit'),
};
