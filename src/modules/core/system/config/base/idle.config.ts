import {IIdleConfig} from 'wlc-engine/modules/core';

export const idleConfig: IIdleConfig = {
    idleMessage: [
        gettext('You have been inactive for 30 minutes.'),
        gettext('You have been logged out for security reasons'),
    ],
    idleTime: 1800000, // 30 minutes
    frequencyChecks: 60000, // 1 minutes
};
