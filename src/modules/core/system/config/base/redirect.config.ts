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
    profileRedirects: {
        'app.profile.loyalty-tournaments.active': 'first',
        'app.profile.loyalty-bonuses.active': 'first',
        'app.profile.loyalty-bonuses.all': 'first',
    },
    states: {
        'app.profile.dashboard': {
            state: 'app.profile.main.info',
            profile: 'first',
        },
    },
};
