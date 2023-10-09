import {ILogTypes} from 'wlc-engine/modules/core/system/config/log-types/index';

export const errorTypes: ILogTypes = {
    '23.0.0': {
        // Error when wallet is not created
        level: 'error',
    },
    '23.0.1': {
        // Сurrency conversion failed
        level: 'error',
    },
};
