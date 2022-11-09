import {ILogTypes} from './index';

export const errorTypes: ILogTypes = {
    '9.0.1': {
        // No document type name
        level: 'warning',
    },
    '9.0.2': {
        // Error when get docs types
        level: 'error',
    },
    '9.0.3': {
        // Error when get file types
        level: 'error',
    },
    '9.0.4': {
        // Error when get user docs
        level: 'error',
    },
    '9.0.5': {
        // Error when upload file
        level: 'error',
    },
    '9.0.6': {
        // Error when delete doc
        level: 'error',
    },
};
