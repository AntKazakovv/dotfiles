import {ILayoutsConfig} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import * as sectionsLib from 'wlc-engine/modules/core/system/config/layouts/sections';

export const $profileFirstLayouts: ILayoutsConfig = {
    'app.profile': {
        extends: 'app',
        sections: {
            'profile-tablet-menu-wrapper': sectionsLib.profileContent.profileTypeFirstTabletMenu,
        },
    },
    'app.profile.history': {
        extends: 'app',
        sections: {
            'profile-content': sectionsLib.profileContent.profileHistoryTypeFirst,
        },
    },
    'app.profile.main.info': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileMainTypeFirst,
        },
    },
    'app.profile.social': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileSocialsFirst,
        },
    },
    'app.profile.loyalty-bonuses.main': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileBonusesMainTypeFirst,
        },
    },
    'app.profile.loyalty-bonuses.active': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileBonusesActiveTypeFirst(false),
        },
    },
    'app.profile.loyalty-bonuses.inventory': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileBonusesInventoryTypeFirst,
        },
    },
    'app.profile.loyalty-bonuses.history': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileBonusesHistoryTypeFirst,
        },
    },
    'app.profile.loyalty-bonuses.promo': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.loyalty-bonuses.system': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.loyalty-tournaments.main': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileTournamentsTypeFirst,
        },
    },
    'app.profile.loyalty-tournaments.history': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileTournamentsHistoryTypeFirst,
        },
    },
    'app.profile.loyalty-tournaments.detail': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileTournamentsDetailTypeFirst,
        },
    },
    'app.profile.cash.deposit': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileDepositTypeFirst,
        },
    },
    'app.profile.cash.withdraw': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWithdrawTypeFirst,
        },
    },
    'app.profile.cash.transfer': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileTransferTypeFirst,
        },
    },
    'app.profile.cash.transactions': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileTransactionsTypeFirst,
        },
    },
    'app.profile.gamblings.bets': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileBetHistoryTypeFirst,
        },
    },
    'app.profile.loyalty-store.main': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileStoreTypeFirst,
        },
    },
    'app.profile.loyalty-store.orders': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.loyalty-level': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileLoyaltyLevelsTypeFirstSingle,
        },
    },
    'app.profile.achievements.main': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileAchievementsTypeFirst,
        },
    },
    'app.profile.messages': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileMessagesTypeFirst,
        },
    },
    'app.profile.verification': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileVerificationTypeFirst,
        },
    },
    'app.profile.kycaml': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileVerificationShuftiProKycamlTypeFirst,
        },
    },
    'app.profile.kyc-questionnaire': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileVerificationKycQuestionnaireTypeFirst,
        },
    },
    'app.profile.limitations': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileLimitationsTypeFirst,
        },
    },
    'app.profile.password': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.notifications': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.payments': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.limits': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.dashboard': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileDashboardTypeFirst,
        },
    },
    'app.profile.cashback-rewards': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileCashbackRewardsFirst,
        },
    },
};
