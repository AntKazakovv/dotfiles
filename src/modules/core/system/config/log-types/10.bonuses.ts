import {ILogTypes} from 'wlc-engine/modules/core/system/config/log-types';

export const errorTypes: ILogTypes = {
    '10.0.0': {
        description: 'Error when get bonuses',
        name: 'Bonuses_get error',
        type: 'Bonuses_get_error',
        level: 'fatal',
    },
    '10.0.1': {
        description: 'Bonus not found',
        name: 'Bonus not found',
        type: 'Bonus_not_found',
    },
    '10.0.2': {
        description: 'Bonus promocode not found',
        name: 'Bonus promocode_not found',
        type: 'Bonus_promocode_not_found',
    },
};
