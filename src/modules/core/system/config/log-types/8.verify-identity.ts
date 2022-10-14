import {ILogTypes} from './index';

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
    '8.0.4': {
        // Getting VerificationSessionID failed (Hellosoda)
    },
    '8.0.5': {
        // Creating VerificationJobID failed (Hellosoda)
    },
    '8.0.6': {
        // Document submitting failed  (Hellosoda)
    },
    '8.0.7': {
        // Checking metrics failed (Hellosoda)
    },
    '8.0.8': {
        // Checking classification failed (Hellosoda)
    },
    '8.0.9': {
        // Ending session failed (Hellosoda)
    },
    '8.0.10': {
        // Loading AcuantCamera failed (Hellosoda)
    },
    '8.0.11': {
        // Initializing AcuantCamera failed (Hellosoda)
    },
};
