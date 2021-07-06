import {ILogTypes} from 'wlc-engine/modules/core/system/config/log-types';

export const errorTypes: ILogTypes = {
    '8.0.0': {
        // Authentication failed (Hellosoda)
        level: 'error',
    },
    '8.0.1': {
        // Getting session ID failed (Hellosoda)
        level: 'warning',
    },
    '8.0.2': {
        // Getting VerificationJobID failed (Hellosoda)
        level: 'warning',
    },
    '8.0.3': {
        // Patching VerificationSessionID failed (Hellosoda)
        level: 'warning',
    },
};
