import {IPanelsConfig} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import * as sectionsLib from 'wlc-engine/modules/core/system/config/layouts/sections';

export const $profileWolfLayouts: IPanelsConfig = {
    'app.profile.history': {
        extends: 'app',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfHistory,
        },
    },
    'app.profile.main.info': {
        extends: 'app',
        sections: {
            'profile-content': sectionsLib.profileContent.profileMainTypeWolf,
        },
    },
    'app.profile.social': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfSocials,
        },
    },
    'app.profile.loyalty-bonuses.main': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfBonusesMain,
        },
    },
    'app.profile.loyalty-bonuses.active': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfBonusesActive,
        },
    },
    'app.profile.loyalty-bonuses.inventory': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfBonusesInventory,
        },
    },
    'app.profile.loyalty-bonuses.history': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfBonusesHistory,
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
            'profile-content': sectionsLib.profileContent.profileTournaments,
        },
    },
    'app.profile.loyalty-tournaments.active': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileTournamentsDetail,
        },
    },
    'app.profile.loyalty-tournaments.history': {
        extends: 'app',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfTournamentsHistory,
        },
    },
    'app.profile.loyalty-tournaments.detail': {
        extends: 'app',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfTournamentsDetail,
        },
    },
    'app.profile.cash.deposit': {
        extends: 'app',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfDeposit,
        },
    },
    'app.profile.cash.withdraw': {
        extends: 'app',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfWithdraw,
        },
    },
    'app.profile.cash.transactions': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfTransactions,
        },
    },
    'app.profile.gamblings.bets': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfBetHistory,
        },
    },
    'app.profile.loyalty-store.main': {
        extends: 'app',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfStore,
        },
    },
    'app.profile.loyalty-store.orders': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.loyalty-level': {
        extends: 'app',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfLoyaltyLevelsSingle,
        },
    },
    'app.profile.achievements.main': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfAchievements,
        },
    },
    'app.profile.quests.main': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfQuests,
        },
    },
    'app.profile.messages': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfMessages,
        },
    },
    'app.profile.verification': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfVerification,
        },
    },
    'app.profile.kycaml': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfVerificationShuftiProKycaml,
        },
    },
    'app.profile.limitations': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfLimitations,
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
        extends: 'app',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.dashboard': {
        extends: 'app',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfDashboard,
        },
    },
    'app.profile.cashback-rewards': {
        extends: 'app',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfCashbackRewards,
        },
    },
    'app.profile.referral': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWolfReferral,
        },
    },
};
