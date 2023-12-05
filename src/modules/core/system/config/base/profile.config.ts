import {IProfileConfig} from 'wlc-engine/modules/core/system/interfaces/base-config/profile.interface';
import {limitType} from 'wlc-engine/modules/core/system/config/base/limitations.config';

export const profileConfig: IProfileConfig = {
    messages: {
        use: false,
    },
    webSockets: {
        userBalance: {
            use: true,
        },
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
    autoLogout: {
        use: false,
        timeList: [20, 25, 30, 35, 40, 45, 50, 55, 59],
    },
    limitations: {
        use: false,
        realityChecker: {
            autoApply: true,
            period: 30,
        },
        limitTypes: [
            limitType.MaxDepositSum,
            limitType.MaxBetSum,
            limitType.MaxLossSum,
            limitType.realityChecker,
            limitType.timeOut,
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
    achievements: {
        use: false,
    },
    transfers: {
        use: false,
    },
    type: 'default',
    legalAge: 18,
};
