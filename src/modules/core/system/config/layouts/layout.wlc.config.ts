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
            'content-wins': sectionsLib.contentGames.homeWinsTournament,
            'content-games-bottom': sectionsLib.contentGames.homeBottom,
            'total-jackpot': sectionsLib.totalJackpotSection.home,
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
    'app.sportsbook': {
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbook,
        },
    },
    'app.betradar': {
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbookBetradar,
        },
    },
    'app.digitain': {
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbookDigitain,
        },
    },
    'app.pinnacle': {
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbookPinnacleSW,
        },
    },
    'app.altenar': {
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbookAltenar,
        },
    },
    'app.tglab': {
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbookTglab,
        },
    },
    'app.bti': {
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbookBti,
        },
    },
    'app.esport': {
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbookEsport,
        },
    },
    'app.nova': {
        extends: 'app',
        sections: {
            content: sectionsLib.content.sportsbookNova,
        },
    },
    'app.contacts': {
        extends: 'app',
        sections: {
            'info-page': sectionsLib.infoPage.contacts,
        },
    },
    'app.contact-us': {
        extends: 'app',
        sections: {
            'contact-us': sectionsLib.contactUs.contactUs,
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
    'app.offline': {
        sections: {
            content: sectionsLib.content.offline,
        },
    },
    'app.something-wrong': {
        sections: {
            content: sectionsLib.content.somethingWrong,
        },
    },
    'app.tournaments': {
        extends: 'app',
        sections: {
            'tournaments': sectionsLib.promoTournaments.def,
        },
    },
    'app.providers': {
        extends: 'app',
        sections: {
            'providers-games': sectionsLib.providers.games,
            'providers': sectionsLib.providers.slider,
        },
    },
};
