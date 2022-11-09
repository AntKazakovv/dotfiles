import {ILogTypes} from './index';

export const errorTypes: ILogTypes = {
    '7.0.0': {
        // Error getting model data
        level: 'error',
    },
    '7.0.1': {
        // Error - empty data
        level: 'error',
    },
    '7.0.2': {
        // Error - incorrect data format
        level: 'error',
    },
    '7.0.3': {
        // Error while creating model
        level: 'fatal',
    },
};
