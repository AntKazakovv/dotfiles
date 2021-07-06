import {ILogTypes} from 'wlc-engine/modules/core/system/config/log-types';

export const errorTypes: ILogTypes = {
    '4.0.0': {
        // sealId not defined
    },
    '4.0.1': {
        // currentDomain does not match regular expression matchDomainRegex
    },
    '4.0.2': {
        // License Validation Link (iter) > 30
    },
    '4.0.3': {
        // License Validation Link (apgHtml & location.host) apgHtml does not contain location.host
    },
};
