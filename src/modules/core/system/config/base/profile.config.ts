import {IProfileConfig} from 'wlc-engine/modules/core/system/interfaces/base-config/profile.interface';
import {profileLimitations} from 'wlc-engine/modules/user/submodules/limitations';

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
        autoApplyRealityChecker: true,
        limitTypes: [
            profileLimitations.limitType.MaxDepositSum,
            profileLimitations.limitType.MaxBetSum,
            profileLimitations.limitType.MaxLossSum,
            profileLimitations.limitType.realityChecker,
            profileLimitations.limitType.timeOut,
        ],
    },
    store: {
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
    type: 'default',
    legalAge: 18,
};
