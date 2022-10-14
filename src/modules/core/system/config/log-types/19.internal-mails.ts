import {ILogTypes} from './index';

export const errorTypes: ILogTypes = {
    '19.0.0': {
        // Error occurred while getting internal mails
        level: 'error',
    },
    '19.0.1': {
        // Error occurred while mark internal mail as read
        level: 'error',
    },
    '19.0.2': {
        // Error occurred while delete internal mail
        level: 'error',
    },
};
