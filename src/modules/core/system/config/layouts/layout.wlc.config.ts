/*
@example

    modify current layout
    <pre>
        modify: [
            {
                type: 'replace',
                position: 'base.wlc-logo#2',
                component: {
                    name: 'base.test-replace'
                },
            },
            {
                type: 'insert',
                position: 'before base.wlc-logo#2',
                component: {
                    name: 'base.test-insert'
                }
            },
            {
                type: 'delete',
                position: 'base.wlc-logo#2',
            }
        ],
    </pre>
*/
import {ILayoutsConfig} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import * as sectionsLib from 'wlc-engine/modules/core/system/config/layouts/sections';

export const $layouts: ILayoutsConfig = {
    'app': {
        replaceConfig: true,
        sections: {
            header: sectionsLib.header.def,
            footer: sectionsLib.footer.themeSecond,
        },
    },
    'app.home': {
        replaceConfig: true,
        extends: 'app',
        sections: {
            'banner-section': sectionsLib.bannerSection.home,
            'categories': sectionsLib.categories.catalog,
            'content-games-top': sectionsLib.contentGames.homeTop,
            'content-wins': sectionsLib.contentGames.homeWins,
            'content-games-bottom': sectionsLib.contentGames.homeBottom,
        },
    },
    'app.gameplay': {
        extends: 'app',
        sections: {
            content: sectionsLib.content.gamePlay,
        },
    },
    'app.promotions': {
        extends: 'app',
        sections: {
            content: sectionsLib.content.promotions,
        },
    },
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
            'profile-content': sectionsLib.profileContent.empty,
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
            'profile-content': sectionsLib.profileContent.empty,
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
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.loyalty-tournaments.active': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.loyalty-tournaments.history': {
        extends: 'app.profile',
        sections: {
            content: sectionsLib.content.empty,
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
            'profile-content': sectionsLib.profileContent.empty,
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
    'app.profile.messages': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.empty,
        },
    },
    'app.profile.verification': {
        extends: 'app.profile',
        sections: {
            'profile-content': sectionsLib.profileContent.profileVerification,
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
    'app.profile.loyalty-level': {
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
            'profile-content': sectionsLib.profileContent.profileDashboard,
        },
    },
    'app.contacts': {
        extends: 'app',
        sections: {
            'info-page': sectionsLib.infoPage.contacts,
        },
    },
    'app.catalog': {
        replaceConfig: true,
        extends: 'app',
        sections: {
            'banner-section': sectionsLib.bannerSection.catalog,
            'categories': sectionsLib.categories.catalog,
            'content-games': sectionsLib.contentGames.catalog,
        },
    },
    'app.catalog.child': {
        extends: 'app.catalog',
    },
    'app.error': {
        extends: 'app',
        sections: {
            content: sectionsLib.content.error,
        },
    },

};
