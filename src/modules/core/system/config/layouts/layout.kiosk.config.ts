import {ILayoutsConfig} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import * as sectionsLib from 'wlc-engine/modules/core/system/config/layouts/sections';
import * as componentLib from 'wlc-engine/modules/core/system/config/layouts/components';


export const $layoutsKiosk: ILayoutsConfig = {
    'app': {
        replaceConfig: true,
        sections: {
            header: sectionsLib.header.kiosk,
        },
    },
    'app.home': {
        replaceConfig: true,
        extends: 'app',
        sections: {
            'banner-section': {
                container: false,
                components: [
                    componentLib.wlcBannersSlider.home,
                ],
            },
            'categories': sectionsLib.categories.catalog,
            'content-games-top': sectionsLib.contentGames.homeTop,
            'winners-section': sectionsLib.winnersSection.stripeDef,
            'content-games-bottom': sectionsLib.contentGames.homeBottom,
        },
    },
    'app.gameplay': {
        extends: 'app',
        sections: {
            content: sectionsLib.content.gamePlay,
        },
    },
    'app.catalog': {
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
    'app.signin': {
        sections: {
            'sign-in-page': sectionsLib.signInPageSection.kiosk,
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
};
