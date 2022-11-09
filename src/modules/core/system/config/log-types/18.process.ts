import {ILogTypes} from './index';

export const errorTypes: ILogTypes = {
    '18.0.0': {
        // Process started
        level: 'info',
    },
    '18.0.1': {
        // Process succeed
        level: 'info',
    },
    '18.0.2': {
        // Process failed
        level: 'fatal',
    },
    '18.0.3': {
        // Process stopped
        level: 'info',
    },
    '18.0.4': {
        // Process restarted
        level: 'info',
    },
};
