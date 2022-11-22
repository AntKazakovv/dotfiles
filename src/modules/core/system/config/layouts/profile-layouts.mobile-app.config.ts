import {IPanelsConfig} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import * as sectionsLib from 'wlc-engine/modules/core/system/config/layouts/mobile-app/sections';

export const $profileMobileAppLayouts: IPanelsConfig = {
    'app.profile': {
        extends: 'app',
        sections: {
            'nav-header': sectionsLib.header.def,
            'profile-menu': sectionsLib.profileMenu.def,
        },
    },
    'app.profile.history': {
        title: gettext('Profile history'),
        extends: 'app',
        sections: {
            'profile-menu': sectionsLib.profileMenu.def,
            'profile-content': sectionsLib.profileContent.profileHistory,
        },
    },
    'app.profile.main.info': {
        title: gettext('Profile'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileMain,
        },
    },
    'app.profile.social': {
        title: gettext('Social'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileSocials,
        },
    },
    'app.profile.loyalty-bonuses.main': {
        title: gettext('Bonuses'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileBonusesMain,
        },
    },
    'app.profile.loyalty-bonuses.active': {
        title: gettext('Active bonuses'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileBonusesActive,
        },
    },
    'app.profile.loyalty-bonuses.inventory': {
        title: gettext('Bonuses inventory'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileBonusesInventory,
        },
    },
    'app.profile.loyalty-bonuses.history': {
        title: gettext('Bonuses history'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileBonusesHistory,
        },
    },
    'app.profile.loyalty-bonuses.promo': {
        title: gettext('Bonuses promo'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.loyalty-bonuses.system': {
        title: gettext('Bonuses system'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.loyalty-tournaments.main': {
        title: gettext('Tournaments'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileTournaments,
        },
    },
    'app.profile.loyalty-tournaments.active': {
        title: gettext('Active tournaments'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileTournamentsDetail,
        },
    },
    'app.profile.loyalty-tournaments.history': {
        title: gettext('Tournaments history'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileTournamentsHistory,
        },
    },
    'app.profile.loyalty-tournaments.detail': {
        title: gettext('Tournaments detail'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileTournamentsDetail,
        },
    },
    'app.profile.cash.deposit': {
        title: gettext('Deposit'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileDeposit,
        },
    },
    'app.profile.cash.withdraw': {
        title: gettext('Withdrawal'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileWithdraw,
        },
    },
    'app.profile.cash.wallet': {
        title: gettext('Wallet'),
        extends: 'app.profile',
        sections: {
            'nav-header': sectionsLib.header.def,
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.cash.transactions': {
        title: gettext('Transactions'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileTransactions,
        },
    },
    'app.profile.gamblings.bets': {
        title: gettext('Bets'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileBetHistory,
        },
    },
    'app.profile.loyalty-store.main': {
        title: gettext('Loyalty store'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileStore,
        },
    },
    'app.profile.loyalty-store.orders': {
        title: gettext('Orders'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.loyalty-level': {
        title: gettext('Loyalty level'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileLoyaltyLevelsSingle,
        },
    },
    'app.profile.messages': {
        title: gettext('Messages'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileMessages,
        },
    },
    'app.profile.verification': {
        title: gettext('Verification'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileVerification,
        },
    },
    'app.profile.kycaml': {
        title: gettext('Kycaml'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileVerificationShuftiProKycaml,
        },
    },
    'app.profile.limitations': {
        title: gettext('Limitations'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileLimitations,
        },
    },
    'app.profile.password': {
        title: gettext('Password'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.notifications': {
        title: gettext('Notifications'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.payments': {
        title: gettext('Payments'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.limits': {
        title: gettext('Limits'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.referrals': {
        title: gettext('Referrals'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.dashboard': {
        title: gettext('Dashboard'),
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileDashboard(false),
        },
    },
};
