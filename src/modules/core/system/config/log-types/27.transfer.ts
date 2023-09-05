import {ILogTypes} from './index';

export const errorTypes: ILogTypes = {
    '27.0.0': {
        // 'Error occurred while sending code for transfer',
        level: 'error',
    },
    '27.0.1': {
        // 'Error occured during code validation',
        level: 'error',
    },
    '27.0.2': {
        // 'Error occured getting transfer params',
        level: 'error',
    },
};
