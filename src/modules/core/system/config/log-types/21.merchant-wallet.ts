import {ILogTypes} from './index';

export const errorTypes: ILogTypes = {
    '21.0.0': {
        // Error getting merchant wallet balance
        level: 'error',
    },
    '21.0.1': {
        // Error transfer funds TO merchant wallet
        level: 'error',
    },
    '21.0.2': {
        // Error transfer funds FROM merchant wallet
        level: 'error',
    },
};
