import {
    IRedirectConfig,
} from 'wlc-engine/modules/core';

export const redirectsConfig: IRedirectConfig = {
    registration: {
        state: 'app.profile.cash.deposit',
    },
    zeroBalance: {
        state: 'app.profile.cash.deposit',
    },
    profileRedirects: {
        'app.profile.loyalty-tournaments.active': 'first',
        'app.profile.loyalty-bonuses.active': 'first',
    },
    states: {
        'app.profile.dashboard': {
            state: 'app.profile.main.info',
            profile: 'first',
        },
    },
};
