import {IIndexing} from 'wlc-engine/modules/core';

export const limitTypeTexts: IIndexing<string> = {
    'MaxDepositSumDay': gettext('Daily deposit limit'),
    'MaxBetSumDay': gettext('Daily bet limit'),
    'MaxLossSumDay': gettext('Daily loss limit'),
    'MaxDepositSumWeek': gettext('Weekly deposit limit'),
    'MaxBetSumWeek': gettext('Weekly bet limit'),
    'MaxLossSumWeek': gettext('Weekly loss limit'),
    'MaxDepositSumMonth': gettext('Monthly deposit limit'),
    'MaxBetSumMonth': gettext('Monthly bet limit'),
    'MaxLossSumMonth': gettext('Monthly loss limit'),
    'CoolOffTime': gettext('Self exclusion'),
};
