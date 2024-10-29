import {ILogTypes} from 'wlc-engine/modules/core/system/config/log-types';

export const errorTypes: ILogTypes = {
    '33.0.0': {
        // Loading time for the full version of the site
        level: 'info',
        durationType: 'fromStart',
    },
    '33.0.1': {
        // Largest Contentful Paint (LCP) metric data
        level: 'info',
        durationType: 'fromStart',
    },
    '33.0.2': {
        // Loading time for banners
        level: 'info',
        durationType: 'fromStart',
    },
    '33.0.3': {
        // Initialization time of the main menu in the header
        level: 'info',
        durationType: 'fromStart',
    },
    '33.0.6': {
        // First Contentful Paint (FCP) metric data
        level: 'info',
        durationType: 'fromStart',
    },
    '33.0.7': {
        // Cumulative Layout Shift (CLS) metric data
        level: 'info',
        durationType: 'fromStart',
    },
    '33.0.8': {
        // Time to First Byte (TTFB) metric data
        level: 'info',
        durationType: 'fromStart',
    },
};
