import {IProfileСonfig} from 'wlc-engine/modules/core/system/interfaces/base-config/profile.interface';

export const profileConfig: IProfileСonfig = {
    messages: {
        use: false,
    },
    verification: {
        use: false,
    },
    store: {
        use: false,
    },
    referrals: {
        use: false,
    },
    dashboard: {
        use: true,
    },
    bonuses: {
        system: {
            use: false,
        },
        inventory: {
            use: false,
        },
    },
    wallet: {
        use: false,
    },
};
