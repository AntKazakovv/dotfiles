import {IErrorTypes} from 'wlc-engine/modules/error/config/error-types';

export const errorTypes: IErrorTypes = {
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
