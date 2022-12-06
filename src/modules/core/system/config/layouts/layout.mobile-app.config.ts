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
import {
    TargetState,
} from '@uirouter/core';

import {ILayoutsConfig} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import * as sectionsLib from 'wlc-engine/modules/core/system/config/layouts/mobile-app/sections';

export const $layoutsMobileApp: ILayoutsConfig = {
    'app': {
        replaceConfig: true,
        sections: {
            'nav-footer': sectionsLib.footer.mobileFooter,
        },
    },
    'app.home': {
        title: gettext('Home'),
        replaceConfig: true,
        extends: 'app',
        sections: {
            'banner-section': sectionsLib.bannerSection.home,
            'categories': sectionsLib.categories.catalog,
            'content-games-first': sectionsLib.contentGames.homeTopSwiper,
            'providers': sectionsLib.providers.slider,
            'content-games-second': sectionsLib.contentGames.newTopSwiper,
            'content-games-third': sectionsLib.contentGames.allTopSwiper,
        },
    },
    'app.gameplay': {
        extends: 'app',
        sections: {
            content: sectionsLib.content.gamePlay,
        },
    },
    'app.promotions': {
        title: gettext('Promotions'),
        extends: 'app',
        sections: {
            content: sectionsLib.content.promotions,
        },
    },
    'app.sportsbook': {
        title: gettext('Sportsbook'),
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbook,
        },
    },
    'app.betradar': {
        title: gettext('Betradar'),
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbookBetradar,
        },
    },
    'app.digitain': {
        title: gettext('Digitain'),
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbookDigitain,
        },
    },
    'app.pinnacle': {
        title: gettext('Pinnacle'),
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbookPinnacleSW,
        },
    },
    'app.altenar': {
        title: gettext('Alternal'),
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbookAltenar,
        },
    },
    'app.tglab': {
        title: gettext('Tglab'),
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbookTglab,
        },
    },
    'app.bti': {
        title: gettext('Offline'),
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbookBti,
        },
    },
    'app.esport': {
        title: gettext('Esport'),
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbookEsport,
        },
    },
    'app.nova': {
        title: gettext('Nova'),
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbookNova,
        },
    },
    'app.contacts': {
        title: gettext('Contacts'),
        extends: 'app',
        sections: {
            'info-page': sectionsLib.infoPage.contacts,
        },
    },
    'app.pages': {
        extends: 'app',
        sections: {
            'pages': {
                container: true,
                components: [
                    {
                        name: 'static.wlc-post',
                    },
                ],
            },
        },
    },
    'app.catalog': {
        title: (targetState: TargetState) => {
            return targetState.state().data?.categoryName;
        },
        replaceConfig: true,
        sections: {
            'nav-header': sectionsLib.header.def,
            'content-games': sectionsLib.contentGames.catalog,
        },
    },
    'app.catalog.child': {
        title: (targetState: TargetState) => {
            return targetState.state().data?.categoryName;
        },
        extends: 'app.catalog',
    },
    'app.error': {
        title: gettext('Error'),
        extends: 'app',
        sections: {
            content: sectionsLib.content.error,
        },
    },
    'app.offline': {
        title: gettext('Offline'),
        sections: {
            content: sectionsLib.content.offline,
        },
    },
    'app.tournaments': {
        title: gettext('Tournaments'),
        extends: 'app',
        sections: {
            'nav-header': sectionsLib.header.def,
            'tournaments': sectionsLib.promoTournaments.def,
        },
    },
    'app.run-game': {
        title: (targetState: TargetState) => {
            return targetState.state().data?.gameName;
        },
        extends: 'app',
        sections: {
            'nav-header': sectionsLib.header.def,
            'providers': sectionsLib.providers.list,
        },
    },
    'app.language': {
        title: gettext('Language'),
        extends: 'app',
        sections: {
            'nav-header': sectionsLib.header.def,
        },
    },
    'app.menu': {
        extends: 'app',
        sections: {
            'user-info-menu': sectionsLib.userInfoSection.menu,
        },
    },
    'app.providers': {
        title: (targetState: TargetState) => {
            return targetState.state().data?.providerName || gettext('Providers');
        },
        extends: 'app',
        sections: {
            'nav-header': sectionsLib.header.def,
            'providers': sectionsLib.providers.list,
        },
    },
    'app.providers.item': {
        title: (targetState: TargetState) => {
            return targetState.state().data?.providerName;
        },
        extends: 'app',
        sections: {
            'nav-header': sectionsLib.header.def,
            'providers-games': sectionsLib.providers.gamesSwiper,
        },
    },
    'app.providers.item.category': {
        title: (targetState: TargetState) => {
            return targetState.state().data?.providerName;
        },
        extends: 'app',
        sections: {
            'nav-header': sectionsLib.header.def,
            'providers-games': sectionsLib.providers.gamesGrid,
        },
    },
    'app.games-search': {
        extends: 'app',
        sections: {
            'categories': sectionsLib.searchSection.def,
        },
    },
    'app.welcome': {
        extends: 'app',
        sections: {
            'welcome': sectionsLib.content.welcome,
        },
    },
};
