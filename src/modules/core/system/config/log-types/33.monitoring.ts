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
};
