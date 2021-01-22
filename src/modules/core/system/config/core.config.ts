import {ICoreConfig} from 'wlc-engine/modules/core';

export const coreConfig: ICoreConfig = {
    redirects: {
        registration: {
            state: 'app.profile.cash.deposit',
        },
        zeroBalance: {
            state: 'app.profile.cash.deposit',
        },
    },
};
