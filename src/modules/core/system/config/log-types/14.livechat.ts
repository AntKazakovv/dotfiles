import {ILogTypes} from './index';

export const errorTypes: ILogTypes = {
    '14.0.0': {
        // Livechat not found
        level: 'error',
    },
    '14.0.1': {
        // Livechat code not found
        level: 'error',
    },
    '14.0.2': {
        // Livechat error while setting user details
        level: 'error',
    },
};
