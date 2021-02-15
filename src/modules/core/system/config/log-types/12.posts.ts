import {ILogTypes} from 'wlc-engine/modules/core/system/config/log-types';

export const errorTypes: ILogTypes = {
    '12.0.0': {
        description: 'Error when get legal text',
        name: 'Legal text get error',
        type: 'Legal_text_get_error',
        level: 'error',
    },
};
