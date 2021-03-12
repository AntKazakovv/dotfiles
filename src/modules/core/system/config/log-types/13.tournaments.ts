import {ILogTypes} from 'wlc-engine/modules/core/system/config/log-types';

export const errorTypes: ILogTypes = {
    '13.0.0': {
        description: 'Error when get tournaments',
        name: 'Tournaments_get error',
        type: 'Tournaments_get_error',
        level: 'fatal',
    },
    '13.0.1': {
        description: 'Tournament not found',
        name: 'Tournament not found',
        type: 'Tournament_not_found',
    },
    '13.0.2': {
        description: 'Tournament top not found',
        name: 'Tournament top not found',
        type: 'Tournament_top_not_found',
    },
    '13.0.3': {
        description: 'Tournament user stats not found',
        name: 'Tournament user stats not found',
        type: 'Tournament_user_stats_not_found',
    },
    '13.0.4': {
        description: 'Tournament user not found',
        name: 'Tournament user not found',
        type: 'Tournament_user_not_found',
    },
};
