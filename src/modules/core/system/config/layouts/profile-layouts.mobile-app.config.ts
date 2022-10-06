import {IPanelsConfig} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import * as sectionsLib from 'wlc-engine/modules/core/system/config/layouts/mobile-app/sections';

export const $profileMobileAppLayouts: IPanelsConfig = {
    'app.profile': {
        extends: 'app',
        sections: {
            'profile-menu': sectionsLib.profileMenu.def,
        },
    },
    'app.profile.history': {
        extends: 'app',
        sections: {
            'profile-menu': sectionsLib.profileMenu.def,
            'profile-content': sectionsLib.profileContent.profileHistory,
        },
    },
    'app.profile.main.info': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileMain,
        },
    },
    'app.profile.social': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileSocials,
        },
    },
    'app.profile.loyalty-bonuses.main': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileBonusesMain,
        },
    },
    'app.profile.loyalty-bonuses.active': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileBonusesActive,
        },
    },
    'app.profile.loyalty-bonuses.inventory': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileBonusesInventory,
        },
    },
    'app.profile.loyalty-bonuses.history': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileBonusesHistory,
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
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileTournamentsHistory,
        },
    },
    'app.profile.loyalty-tournaments.detail': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileTournamentsDetail,
        },
    },
    'app.profile.cash.deposit': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileDeposit,
        },
    },
    'app.profile.cash.withdraw': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWithdraw,
        },
    },
    'app.profile.cash.wallet': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.cash.transactions': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileTransactions,
        },
    },
    'app.profile.gamblings.bets': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileBetHistory,
        },
    },
    'app.profile.loyalty-store.main': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileStore,
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
            'profile-content': sectionsLib.profileContent.profileLoyaltyLevelsSingle,
        },
    },
    'app.profile.messages': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileMessages,
        },
    },
    'app.profile.verification': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileVerification,
        },
    },
    'app.profile.kycaml': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileVerificationShuftiProKycaml,
        },
    },
    'app.profile.limitations': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileLimitations,
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
    'app.profile.referrals': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.dashboard': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileDashboard(false),
        },
    },
};
