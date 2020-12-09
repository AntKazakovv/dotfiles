import {BaseConfigType} from 'wlc-engine/modules/core/system/interfaces/base-config.interface';

export const $base: BaseConfigType = {
    profile: {
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
    },
    tournaments: {
        use: false,
    },
};
