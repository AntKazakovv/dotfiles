import {
    IProfileConfig,
    TIndexingLimitTypeItems,
} from 'wlc-engine/modules/core/system/interfaces/base-config/profile.interface';

export namespace profileLimitations {

    export const limitType: TIndexingLimitTypeItems = {
        MaxDepositSum: {
            title: gettext('Deposit limit'),
            value: 'MaxDepositSum',
        },
        MaxBetSum: {
            title: gettext('Wager limit'),
            value: 'MaxBetSum',
        },
        MaxLossSum: {
            title: gettext('Loss limit'),
            value: 'MaxLossSum',
        },
        realityChecker: {
            title: gettext('Reality checker'),
            value: 'realityChecker',
        },
        timeOut: {
            title: gettext('Time out'),
            value: 'timeOut',
        },
    };
}

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
