import {ILogTypes} from './index';

export const errorTypes: ILogTypes = {
    '2.1.0': {
        // Error on validation
    },
    '2.1.1': {
        // Timeout on validation
    },
    '2.1.2': {
        // Error on check promocode correct
        level: 'error',
    },
};
