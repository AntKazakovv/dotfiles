import _merge from 'lodash-es/merge';

import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {IGameThumbCParams} from 'wlc-engine/modules/games/components/game-thumb/game-thumb.params';
import {
    IGamesGridCParams,
    IShowAsSwiper,
} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';
import {ISearchFieldCParams} from 'wlc-engine/modules/games/components/search-field/search-field.params';

export type ComponentTheme = 'default' | 'easy' | CustomType;

export interface IGamesGridCParamsPartial extends IGamesGridCParams {
    type: never,
    byState: never,
    showAllLink: never,
    searchFilterName: never,
};

export interface ISearchCParams extends IComponentParams<ComponentTheme, string, string> {
    common?: {
        gamesGridParams?: IGamesGridCParamsPartial;
        openProvidersList?: boolean,
    },
    searchInputParams?: ISearchFieldCParams;
    easyThemeParams?: {
        /**
         * Text for title for easy theme
         */
        titleText?: string;
        /**
         * Works with theme===easy
         */
        searchGamesGrid?: IGamesGridCParams;
        /**
         * Show merchants in sort order first
         * Works with theme===easy
         */
        showMerchantsFirst?: boolean;
        /**
         * recommended text
         */
        recommendedText?: string;
        /**
         * recent search text
         */
        recentSearchText?: string;
        /**
         * text when no games
         */
        emptyText?: string;
        /**
         * Works with theme===easy
         */
        secondBlock?: {
            /**
             * Hide second block(popular games) on search games
             */
            hideOnFindGames?: boolean;
            /**
             * Params for games grid on hideSecondBlockOnFindGames is truthy
             */
            swiperOptionsOnHideSecondBlock?: IShowAsSwiper;
            /**
             * second block games grid
             */
            gamesGrid?: IGamesGridCParams;
        };
    }
};

export type PanelType = 'merchants' | 'categories';

const defaultShowAsSwiper: IShowAsSwiper = {
    useNavigation: true,
    sliderParams: {
        swiper: {
            virtual: true,
            slidesPerView: 1,
            slidesPerGroup: 1,
            grid: null,
            spaceBetween: 10,
            breakpoints: {
                375: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    spaceBetween: 10,
                },
                560: {
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    spaceBetween: 10,
                },
                720: {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                    spaceBetween: 10,
                },
                1024: {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                    spaceBetween: 15,
                },
                1200: {
                    slidesPerView: 5,
                    slidesPerGroup: 5,
                    spaceBetween: 15,
                },
                1630: {
                    slidesPerView: 5,
                    slidesPerGroup: 5,
                    spaceBetween: 20,
                },
            },
        },
    },
};

const showAsSwiper: IShowAsSwiper = _merge(
    {},
    defaultShowAsSwiper,
    <IShowAsSwiper>{
        sliderParams: {
            swiper: {
                breakpoints: {
                    375: {
                        grid: {
                            rows: 2,
                            fill: 'row',
                        },
                    },
                    560: {
                        grid: {
                            rows: 2,
                            fill: 'row',
                        },
                    },
                    720: {
                        grid: null,
                    },
                    1024: {
                        grid: null,
                    },
                    1200: {
                        grid: null,
                    },
                    1630: {
                        grid: null,
                    },
                },
            },
        },
    },
);

const swiperOptionsOnHideSecondBlock: IShowAsSwiper = _merge(
    {},
    defaultShowAsSwiper,
    <IShowAsSwiper>{
        sliderParams: {
            swiper: {
                breakpoints: {
                    375: {
                        grid: {
                            rows: 3,
                            fill: 'row',
                        },
                    },
                    560: {
                        grid: {
                            rows: 3,
                            fill: 'row',
                        },
                    },
                    720: {
                        grid: {
                            rows: 2,
                            fill: 'row',
                        },
                    },
                    1024: {
                        grid: {
                            rows: 2,
                            fill: 'row',
                        },
                    },
                    1200: {
                        grid: {
                            rows: 2,
                            fill: 'row',
                        },
                    },
                    1630: {
                        grid: {
                            rows: 2,
                            fill: 'row',
                        },
                    },
                },
            },
        },
    },
);

const thumbParams: IGameThumbCParams = {
    common: {
        merchantIcon: {
            showNameInsteadIcon: true,
            use: true,
        },
    },
};

export const defaultParams: ISearchCParams = {
    moduleName: 'games',
    componentName: 'wlc-search',
    class: 'wlc-search',
    theme: 'default',
    common: {
        openProvidersList: false,
    },
    searchInputParams: {
        focus: true,
        searchFrom: 'modal',
        placeholder: gettext('Start writing game or provider name'),
    },
    easyThemeParams: {
        titleText: gettext('Search for games'),
        recommendedText: gettext('Search requires at least 3 characters.'),
        recentSearchText: gettext('Recent search:'),
        emptyText: gettext('Sorry, but nothing was found. Check the spelling or try a different name.'),
        showMerchantsFirst: false,
        searchGamesGrid: {
            theme: 'swiper',
            title: gettext('Search result:'),
            thumbParams,
            showAsSwiper,
        },
        secondBlock: {
            hideOnFindGames: true,
            gamesGrid: {
                theme: 'swiper',
                title: gettext('Popular games:'),
                filter: {
                    categories: ['popular'],
                },
                thumbParams,
                showAsSwiper,
            },
            swiperOptionsOnHideSecondBlock,
        },
    },
};

export const defaultGamesGridParams: IGamesGridCParams = {
    type: 'search',
    searchFilterName: 'modal',
    gamesRows: 3,
    showTitle: false,
    usePlaceholders: false,
    byState: true,
    hideEmpty: true,
    showProgressBar: true,
    moreBtn: {
        hide: false,
        lazy: false,
    },
    breakpoints: {
        375: {
            gamesRows: 2,
        },
        1630: {
            gamesRows: 3,
        },
    },
};
