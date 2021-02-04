import {ILogTypes} from 'wlc-engine/modules/core/system/config/log-types';

export const errorTypes: ILogTypes = {
    '11.0.0': {
        description: 'Error when get store',
        name: 'Store_get error',
        type: 'Store_get_error',
        level: 'fatal',
    },
    '11.0.1': {
        description: 'Error when get store orders',
        name: 'Store_orders_get error',
        type: 'Store_orders_get_error',
        level: 'fatal',
    },
};
