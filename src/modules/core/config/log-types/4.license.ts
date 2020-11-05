import {ILogTypes} from 'wlc-engine/modules/core/config/log-types';

export const errorTypes: ILogTypes = {
    '4.0.0': {
        description: 'sealId not defined',
        name: 'License Validation Link (sealId)',
        type: 'License_validation_link',
    },
    '4.0.1': {
        description: 'currentDomain does not match regular expression matchDomainRegex',
        name: 'License Validation Link (matchDomainRegex)',
        type: 'License_validation_link',
    },
    '4.0.2': {
        description: 'iter > 30',
        name: 'License Validation Link (iter)',
        type: 'License_validation_link',
    },
    '4.0.3': {
        description: 'apgHtml does not contain location.host',
        name: 'License Validation Link (apgHtml & location.host)',
        type: 'License_validation_link',
    },
};
