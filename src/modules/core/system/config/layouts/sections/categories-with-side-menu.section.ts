import {IWrapperCParams} from 'wlc-engine/modules/core';
import * as componentLib from '../components';
import {ICategoryMenuCParams} from 'wlc-engine/modules/menu';

interface IGamesGridConfig {
    title: string;
    category: string;
    link?: string;
}

export const getGamesGridConfig = (
    title: string,
    category: string,
    link: string = 'app.catalog',
) => {
    return {
        name: 'games.wlc-games-grid',
        params: {
            themeMod: 'game-block',
            gamesRows: 2,
            title,
            filter: {
                category,
            },
            usePlaceholders: true,
            showAllLink: {
                use: true,
                link,
                useCounter: false,
                params: {
                    category: (link === 'app.catalog.child') ? 'casino' : category,
                    childCategory: (link === 'app.catalog.child') ? category : null,
                },
            },
            moreBtn: {
                hide: true,
                lazy: false,
            },
            mobileSettings: {
                gamesRows: 3,
            },
        },
    };
};

export const sideMenuHome = {

    getCatalog: (gameCategories?: IGamesGridConfig[]) => {

        const gridComponents = (gameCategories)
            ? gameCategories.map(item => getGamesGridConfig(item.title, item.category, item.link))
            : [
                getGamesGridConfig(gettext('Popular games'), 'popular'),
                getGamesGridConfig(gettext('New games'), 'new'),
                getGamesGridConfig(gettext('Jackpots'), 'jackpots', 'app.catalog.child'),
                getGamesGridConfig(gettext('Live Casino'), 'livecasino'),
            ];
        return {
            container: true,
            components: [
                {
                    name: 'core.wlc-wrapper',
                    params: <IWrapperCParams>{
                        class: 'wlc-side-menu',
                        components: [
                            componentLib.wlcButton.search,
                            {
                                ...componentLib.wlcButton.searchMerchants,
                                display: {
                                    after: 900,
                                },
                            },
                            {
                                name: 'core.wlc-title',
                                params: {
                                    customMod: ['categories-title'],
                                    mainText: gettext('Categories'),
                                    wlcElement: 'categories_title',
                                },
                                display: {
                                    after: 900,
                                },
                            },
                            {
                                name: 'menu.wlc-category-menu',
                                params: <ICategoryMenuCParams>{
                                    type: 'dropdown',
                                    theme: 'dropdown',
                                    themeMod: 'vertical',
                                    common: {
                                        icons: {
                                            use: true,
                                        },
                                    },
                                    menuParams: {
                                        expandOnStart: true,
                                    },
                                },
                                display: {
                                    after: 900,
                                },
                            },
                        ],
                    },
                },
                {
                    name: 'core.wlc-wrapper',
                    params: <IWrapperCParams>{
                        class: 'wlc-games-catalog',
                        components: gridComponents,
                    },
                },
            ],
        };
    },
};

export const sideMenuCatalog = {
    container: true,
    components: [
        {
            name: 'core.wlc-wrapper',
            params: <IWrapperCParams>{
                class: 'wlc-side-menu',
                components: [
                    componentLib.wlcButton.search,
                    {
                        ...componentLib.wlcButton.searchMerchants,
                        display: {
                            after: 900,
                        },
                    },
                    {
                        name: 'core.wlc-title',
                        params: {
                            customMod: ['categories-title'],
                            mainText: gettext('Categories'),
                            wlcElement: 'categories_title',
                        },
                        display: {
                            after: 900,
                        },
                    },
                    {
                        name: 'menu.wlc-category-menu',
                        params: <ICategoryMenuCParams>{
                            type: 'dropdown',
                            theme: 'dropdown',
                            themeMod: 'vertical',
                            common: {
                                icons: {
                                    use: true,
                                },
                            },
                            menuParams: {
                                expandOnStart: true,
                            },
                        },
                        display: {
                            after: 900,
                        },
                    },
                ],
            },
        },
        componentLib.wlcGamesCatalog.def,
    ],
};
