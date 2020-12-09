import {ILogTypes} from 'wlc-engine/modules/core/system/config/log-types/index';

export const errorTypes: ILogTypes = {
    '2.1.0': {
        description: 'Error on validation',
        name: 'Validation Error',
        type: 'Validation_Error',
    },
    '2.1.1': {
        description: 'Timeout on validation',
        name: 'Validation Timeout',
        type: 'Validation_Timeout',
    },
};
