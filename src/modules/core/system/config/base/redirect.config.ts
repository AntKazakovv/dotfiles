import {IRedirectConfig} from 'wlc-engine/modules/core';

export const redirectsConfig: IRedirectConfig = {
    registration: {
        state: 'app.profile.cash.deposit',
    },
    zeroBalance: {
        state: 'app.profile.cash.deposit',
    },
};
