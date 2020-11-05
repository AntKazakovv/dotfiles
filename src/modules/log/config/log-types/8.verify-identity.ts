import {ILogTypes} from 'wlc-engine/modules/log/config/log-types';

export const errorTypes: ILogTypes = {
    '8.0.0': {
        description: 'Authentication failed',
        name: 'Authentication failed',
        type: 'Authentication_failed',
        level: 'error',
        group: 'Hellosoda',
    },
    '8.0.1': {
        description: 'Getting session ID failed',
        name: 'Getting session ID failed',
        type: 'Getting_session_ID_failed',
        level: 'warning',
        group: 'Hellosoda',
    },
    '8.0.2': {
        description: 'Getting VerificationJobID failed',
        name: 'Getting VerificationJobID failed',
        type: 'Getting_VerificationJobID_failed',
        level: 'warning',
        group: 'Hellosoda',
    },
    '8.0.3': {
        description: 'Patching VerificationSessionID failed',
        name: 'Patching VerificationSessionID failed',
        type: 'Patching_VerificationSessionID_failed',
        level: 'warning',
        group: 'Hellosoda',
    },
};
