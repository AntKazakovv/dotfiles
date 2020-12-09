import {ILogTypes} from 'wlc-engine/modules/core/system/config/log-types/index';

export const errorTypes: ILogTypes = {
    '6.0.0': {
        description: 'Page not found',
        name: '404 error',
        type: '404_error',
        level: 'error',
        group: '404 not found',
    },
};
