import {ILogTypes} from 'wlc-engine/modules/core';

export const errorTypes: ILogTypes = {
    '15.0.0': {
        // 'Error occurred while sending code for SMS Verification',
        level: 'error',
    },
    '15.0.1': {
        // 'Error occured during code validation',
        level: 'error',
    },
    '15.0.2': {
        // 'Error occurred while checking SMS status',
        level: 'error',
    },
};
