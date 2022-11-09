import {ILogTypes} from './index';

export const errorTypes: ILogTypes = {
    '13.0.0': {
        // Error when get tournaments
        level: 'fatal',
    },
    '13.0.1': {
        // Tournament not found
    },
    '13.0.2': {
        // Tournament top not found
    },
    '13.0.3': {
        // Tournament user stats not found
    },
    '13.0.4': {
        // Tournament user not found
    },
};
