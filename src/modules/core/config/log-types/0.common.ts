import {ILogTypes} from 'wlc-engine/modules/core/config/log-types';

export const errorTypes: ILogTypes = {
    '0.0.0': {
        description: 'Index file successfully downloaded',
        name: 'Site started',
        type: 'start_time',
        level: 'log',
        method: 'Flog',
    },
    '0.0.1': {
        description: 'Site loading time exceeded',
        name: 'Site loading time exceeded',
        type: 'time_exceeded',
        level: 'error',
        group: 'Common',
    },
    '0.0.2': {
        description: 'Autotest Start',
        name: 'Autotest Start',
        type: 'auto_test',
        level: 'info',
        group: 'AutoTest',
    },
    '0.0.3': {
        description: 'Autotest api log',
        name: 'Api log',
        type: 'api_response',
        level: 'info',
        group: 'AutoTest',
    },
    '0.0.4': {
        description: 'Autotest api error log',
        name: 'Api error log',
        type: 'api_response_error',
        level: 'warning',
        group: 'AutoTest',
    },
    '0.0.5': {
        description: 'Require load error',
        name: 'Require load error',
        type: 'require_load_error',
        level: 'fatal',
        group: 'Load',
    },
    '0.0.6': {
        description: 'Bootstrap load error',
        name: 'Bootstrap load error',
        type: 'bootstrap_load_error',
        level: 'fatal',
        group: 'Load',
    },
    '0.0.7': {
        description: 'AppDeclarator run error',
        name: 'AppDeclarator run error',
        type: 'app_declarator_run_error',
        level: 'fatal',
        group: 'Load',
    },
    '0.0.8': {
        description: 'Site compile time exceeded',
        name: 'Site compile time exceeded',
        type: 'time_exceeded',
        level: 'error',
        group: 'Common',
    },
    '0.0.9': {
        description: 'Site compilation time',
        name: 'Site compile',
        type: 'site_compile',
        level: 'log',
        method: 'Flog',
    },
    '0.0.10': {
        description: 'User left the site before compilation',
        name: 'User left the site',
        type: 'site_compile',
        level: 'log',
        method: 'Flog',
    },
    '0.0.11': {
        description: 'Forbidden file successfully downloaded',
        name: 'Forbidden started',
        type: 'start_time',
        level: 'log',
        method: 'Flog',
    },
    '0.0.12': {
        description: 'Request errors',
        name: 'Request errors',
        type: 'request_errors',
        level: 'log',
        method: 'Both',
        group: 'Common',
    },

    '0.1.1': {
        description: 'No bonuses from fundist',
        name: 'No bonuses',
        type: 'No_bonuses',
        level: 'warning',
    },
    '0.1.2': {
        description: 'Bonuses request error',
        name: 'Bonuses request error',
        type: 'Bonuses_request_error',
    },
    '0.1.3': {
        description: 'Bonuses response error',
        name: 'Bonuses response error',
        type: 'Bonuses_response_error',
    },
    '0.1.4': {
        description: 'Registration request error',
        name: 'Registration request error',
        type: 'Registration_request_error',
    },
    '0.1.5': {
        description: 'Registration response error',
        name: 'Registration response error',
        type: 'Registration_response_error',
    },
    '0.1.6': {
        description: 'Bonuses request error in getBonuses',
        name: 'Bonuses request error',
        type: 'Bonuses_request_error',
    },
    '0.1.7': {
        description: 'Bonuses request error in getBonusesByCode',
        name: 'Bonuses request error',
        type: 'Bonuses_request_error',
    },

    // Affiliate logs
    '0.2.0': {
        description: 'Affiliate unique send successfully',
        name: 'Affiliate unique success',
        type: 'Affiliate',
        level: 'log',
        method: 'Flog',
    },
    '0.2.1': {
        description: 'Affiliate unique send error',
        name: 'Affiliate unique error',
        type: 'Affiliate',
        level: 'log',
        method: 'Flog',
    },
    '0.2.2': {
        description: 'Affiliate unique send request',
        name: 'Affiliate unique request',
        type: 'Affiliate',
        level: 'log',
        method: 'Flog',
    },
    '0.2.3': {
        description: 'Affiliate cookies exists',
        name: 'Affiliate cookies exists',
        type: 'Affiliate',
        level: 'log',
        method: 'Flog',
    },

    '0.3.0': {
        description: 'Modal window doesn\'t exist.',
        name: 'Modal window does\'t exist',
        type: 'modal_window',
        level: 'error',
        group: 'Common',
    },
    '0.3.1': {
        description: 'Modal config must have "id" parameter',
        name: 'Modal id is not found',
        type: 'modal_window',
        level: 'error',
        group: 'Common',
    }
};
