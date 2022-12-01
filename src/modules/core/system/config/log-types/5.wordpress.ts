import {ILogTypes} from './index';

export const errorTypes: ILogTypes = {
    '5.0.0': {
        // Post by slug is not found
        level: 'warning',
    },
    '5.0.1': {
        // The response time from the WP exceeded 3 seconds
    },
    '5.0.2': {
        // Error while getting data from WP
        level: 'fatal',
    },
    '5.0.3': {
        // WP data.data is not array
        level: 'error',
    },
    '5.0.4': {
        // Error while getting CategoryBySlug from WP
        level: 'fatal',
    },
    '5.0.5': {
        // Error while getting getSubCategories from WP
        level: 'fatal',
    },
    '5.0.6': {
        // Error while getting getPostsListByCategory from WP
        level: 'fatal',
    },
    '5.1.0': {
        // Error receiving WP content data from a external source
        level: 'fatal',
    },
    '5.1.1': {
        // Empty WP content from a external source
        level: 'warning',
    },
    '5.1.2': {
        // Response from WP an external source doesn`t match with pattern
        level: 'error',
    },
    '5.1.3': {
        // URL to an external source is not specified
        level: 'warning',
    },
    '5.2.0': {
        // Error occurs while downloading pdf file
        level: 'error',
    },
};
