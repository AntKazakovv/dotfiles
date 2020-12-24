import {ICoreConfig} from '../interfaces/core.interface';

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
