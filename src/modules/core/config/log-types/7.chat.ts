import {ILogTypes} from 'wlc-engine/modules/core/config/log-types';

export const errorTypes: ILogTypes = {
    '7.0.0': {
        description: 'Livechat not found',
        name: 'Livechat not found',
        type: 'Livechat_not_found',
        level: 'error',
        group: 'Livechat',
    },
    '7.0.1': {
        description: 'Livechat code not found',
        name: 'Livechat code not found',
        type: 'Livechat_code_not_found',
        level: 'error',
        group: 'Livechat',
    },
};
