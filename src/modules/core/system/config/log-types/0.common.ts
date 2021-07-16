import {ILogTypes} from 'wlc-engine/modules/core/system/config/log-types';

export const errorTypes: ILogTypes = {
    '0.0.0': {
        // Index file successfully downloaded
    },
    '0.0.1': {
        // Site loading time exceeded
        level: 'error',
    },
    '0.0.2': {
        // Autotest Start
        level: 'info',
    },
    '0.0.3': {
        // Autotest api log
        level: 'info',
    },
    '0.0.4': {
        // Autotest api error log
        level: 'warning',
    },
    '0.0.5': {
        // Require load error (Deprecated)
        level: 'fatal',
    },
    '0.0.6': {
        // Bootstrap load error
        level: 'fatal',
    },
    '0.0.7': {
        // AppDeclarator run error (Deprecated)
        level: 'fatal',
    },
    '0.0.8': {
        // Site compile time exceeded
        level: 'error',
    },
    '0.0.9': {
        // Site compilation time
        durationType: 'fromStart',
    },
    '0.0.10': {
        // User left the site before compilation
        durationType: 'fromStart',
    },
    '0.0.11': {
        // Forbidden file successfully downloaded
    },
    '0.0.12': {
        // Request errors
    },

    '0.1.1': {
        // No bonuses from fundist
        level: 'warning',
    },
    '0.1.2': {
        // Bonuses request error
    },
    '0.1.3': {
        // Bonuses response error
    },
    '0.1.4': {
        // Registration request error
    },
    '0.1.5': {
        // Registration response error
    },
    '0.1.6': {
        // Bonuses request error in getBonuses
    },
    '0.1.7': {
        // Bonuses request error in getBonusesByCode
    },

    // Affiliate logs
    '0.2.0': {
        // Affiliate unique send successfully
    },
    '0.2.1': {
        // Affiliate unique send error
    },
    '0.2.2': {
        // Affiliate unique send request
    },
    '0.2.3': {
        // Affiliate cookies exists
    },

    '0.3.0': {
        // Modal window doesn't exist
        level: 'error',
    },
    '0.3.1': {
        // Modal config must have "id" parameter
        level: 'error',
    },
    '0.3.2': {
        // Can't show modal, wrong params
        level: 'error',
    },
    '0.3.3': {
        // Can't hide or close modal, wrong params
        level: 'error',
    },

    '0.4.0': {
        // Panel doesn't exist
        level: 'error',
    },
    '0.4.1': {
        // Panel type is invalid
        level: 'error',
    },
    '0.5.0': {
        // IndexedDb not supported on device
        level: 'error',
    },
    '0.5.1': {
        // Error during to save data in IndexedDb
        level: 'error',
    },
    '0.5.2': {
        // Error during to read data in IndexedDb
        level: 'error',
    },
    '0.5.3': {
        // Error during to clear data in IndexedDb
        level: 'error',
    },
    '0.5.4': {
        // Error during to save data in LocalStorage
        level: 'error',
    },
    '0.5.5': {
        // Error during to read data in LocalStorage
        level: 'error',
    },
    '0.5.6': {
        // Error during to clear data in LocalStorage
        level: 'error',
    },
    '0.6.0': {
        // Notification doesn't exist
        level: 'error',
    },
    '0.7.0': {
        // Error loading flag image
        level: 'log',
    },
};
