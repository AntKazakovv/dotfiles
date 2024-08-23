import {
    IRedirectConfig,
} from 'wlc-engine/modules/core/system/interfaces/core.interface';

export const redirectsConfig: IRedirectConfig = {
    registration: {
        state: 'app.profile.cash.deposit',
    },
    zeroBalance: {
        state: 'app.profile.cash.deposit',
    },
    states: {
        'app.profile.dashboard': {
            state: 'app.profile.main.info',
            profile: 'first',
        },
    },
};
