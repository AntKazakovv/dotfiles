import {IProfileConfig} from 'wlc-engine/modules/core/system/interfaces/base-config/profile.interface';

export const profileConfig: IProfileConfig = {
    messages: {
        use: false,
    },
    smsVerification: {
        use: false,
        useInProfile: false,
    },
    verification: {
        use: true,
        selectModeFrom: 4,
        maxDocsCount: 5,
        maxSize: 4,
    },
    limitations: {
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
    type: 'default',
    legalAge: 18,
};
