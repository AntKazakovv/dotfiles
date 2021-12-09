import {RawParams} from '@uirouter/core';
import {
    IIndexing,
    IComponentParams,
    IButtonCParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {
    CategoryModel,
    Game,
    IGamesFilterData,
    IGameThumbCParams,
    IProgressBarCParams,
} from 'wlc-engine/modules/games';
import {
    ITournamentGames,
} from 'wlc-engine/modules/tournaments';
import {
    IBannersSliderCParams,
    ISliderCParams,
} from 'wlc-engine/modules/promo';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | 'search';

/**
 * TODO remove this interface after fix in GamesGrid configuration in project layouts
 * @deprecated use `IGamesFilterData` instead
 */
export interface IGamesFilterEasy {
    category?: string;
}

export interface IGamesGridTitleIcon {
    name?: string,
    byCategory?: boolean;
    folder?: string;
    fallback?: string;
}

export interface IGamesGridShowAllLink {
    use?: boolean;
    useCounter?: boolean;
    /** @deprecated use `sref` instead */
    link?: string;
    sref?: string;
    params?: RawParams;
    text?: string;
}

export interface IGamesGridMoreBtn {
    cardView?: boolean;
    hide?: boolean;
    lazy?: boolean;
    lazyTimeout?: number;
    scrollToEnd?: boolean;
    /**
     * if true will be turned on loading games by scroll after click on 'load more' button
     */
    lazyAfterClick?: boolean;
}

/** @deprecated use `IGamesGridBreakpoints` param instead */
export interface IGamesGridMobileSettings {
    showLoadButton?: boolean;
    gamesRows?: number;
}

/** @deprecated use `IGamesGridBreakpoints` param instead */
export interface IGamesGridTabletSettings {
    showLoadButton?: boolean;
    gamesRows?: number;
}

export interface IGamesGridBreakpoints {
    gamesRows?: number;
    showTitle?: boolean;
    showAllLink?: IGamesGridShowAllLink;
    moreBtn?: IGamesGridMoreBtn;
    showProgressBar?: boolean;
}

export interface IShowAsSwiper {
    sliderParams: ISliderCParams;
}

export interface INoContentTexts extends IIndexing<string> {
    default?: string;
}

export interface IGamesGridCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    /**
     * Amount of rows in a grid. `4` by default.
     */
    gamesRows?: number;
    /**
     * List of games, which will be showed in games grid (filtering logic not needed)
     */
    gamesList?: Game[];
    /**
     * Subcategory (is usually needed for game blocks)
     */
    category?: CategoryModel;
    /**
     * Sets the filter which returns games list for tournaments games grid.
     *
     * This filter has higher priority after inline parameter `gameList`.
     *
     * If no one filter is defined, games list contains all games.
     */
    tournamentGamesFilter?: ITournamentGames;
    /**
     * Sets the filter which returns games list for current state category.
     *
     * This filter has priority after inline parameter `gameList` and parameter `tournamentGamesFilter`.
     *
     * If no one filter is defined, games list contains all games.
     */
    byState?: boolean;
    /**
     * Sets the filter which returns games list according to filter object.
     *
     * This filter has lower priority.
     *
     * If no one filter is defined, or `filter` is empty, games list contains all the games.
     */
    filter?: IGamesFilterData | IGamesFilterEasy;
    /**
     * Defines if `title` will be visible. `true` by default.
     */
    showTitle?: boolean;
    /**
     * If filter `byState` chosen title will be defined by state category.
     *
     * If this param isn't defined and filter `filter` contains category,
     * title will be defined by first category in the list.
     *
     * Otherwise param, set through configuration will be applied.
     */
    title?: string;
    /**
     * Filling games grid with placeholders before game list will be loaded. `true` by default.
     *
     * Useful for blocks on main page, which are could be implemented before games catalog being ready.
     * (Most of another states are protected and wait for catalog).
     */
    usePlaceholders?: boolean;
    /**
     * Set of parameters for icon before title. Undefined by default.
     * @param {boolean} byCategory if `true` and `filter` contains category,
     * icon name will be set based on category name. The same algorithm as in category menu
     * @param {string} name name of icon which be used if `byCategory` is `undefined` or `false`.
     * @param {string} folder base folder for icon. By default uses param `$menu.categoryMenu.icons.folder`.
     * @param {string} fallback fallback icon, if icon not be founded and loaded
     */
    titleIcon?: IGamesGridTitleIcon;
    /**
     * Set of parameters for banner in the grid. Undefined by default.
     */
    bannerSettings?: IBannersSliderCParams;
    /**
     * Set of parameters fot `show all` link.
     * @param use define if link is visible. `false` by default.
     * @param useCounter if `true` visualize amount of games in filtered request.
     * @param link `uiSref` link parameter.
     * @param params `uiParams` link parameters.
     * @param text text of link. `Show all` by default.
     */
    showAllLink?: IGamesGridShowAllLink;
    /**
     * Set of parameters for `Load more` functionality.
     * @param cardView if `true` show as card (not as button). Usually will need for show game blocks
     * @param hide if `true` hides the button. `false` by default.
     * @param lazy if `true` loads games on scroll to bottom of component element. `false` by default.
     * @param lazyTimeout debounce timeout. `1000` by default.
     * @param scrollToEnd if `true` auto scroll to the end of root component element. `true` by default.
     */
    moreBtn?: IGamesGridMoreBtn;
    /**
     * Set of parameters for show games grid as swiper
     * @param sliderParams params of slider
     */
    showAsSwiper?: IShowAsSwiper;
    /**
     * Value for parameter `from` on event listeners queries.
     *
     * Works with `searchFrom` parameter of SearchComponent. They must have the same name to work together.
     */
    searchFilterName?: string;
    /**
     * If `true` visualize progress bar.
     */
    showProgressBar?: boolean;
    /**
     * If `true` hides the component if games list is empty.
     */
    hideEmpty?: boolean;
    /**
     * Params for game thumb.
     */
    thumbParams?: IGameThumbCParams,
    /**
     * @deprecated use `breakpoints` param instead
     * Set of parameters for mobile visualization.
     */
    mobileSettings?: IGamesGridMobileSettings;
    /**
     * @deprecated use `breakpoints` param instead
     * Set of parameters for tablet visualization.
     */
    tabletSettings?: IGamesGridTabletSettings;
    /**
     * Parameters by breakpoints. Use ascending order (mobile-first approach).
     *
     * Available keys: `number` (breakpoint) or `'mobile' | 'tablet' | 'desktop'`.
     *
     * If keys are mixed, only numbers will be applied.
     */
    breakpoints?: IIndexing<IGamesGridBreakpoints>;
    /**
     * Parameters for change progress bar
     */
    progressBar?: IProgressBarCParams;
    /**
     * Parameters for change load more btn
     */
    btnLoadMore?: IButtonCParams;
    /**
     * Parameter to change default noContent text if games not loaded.
     * Also you can add parameter with category name to set it noContent text.
     */
    noContentText?: INoContentTexts;
}

export const defaultParams: IGamesGridCParams = {
    moduleName: 'games',
    componentName: 'wlc-games-grid',
    class: 'wlc-games-grid',
    gamesRows: 4,
    usePlaceholders: true,
    showTitle: true,
    showAllLink: {
        use: false,
        text: gettext('Show all'),
    },
    moreBtn: {
        hide: false,
        lazy: false,
        lazyTimeout: 0,
        scrollToEnd: true,
        lazyAfterClick: false,
        cardView: false,
    },
    btnLoadMore: {
        common: {
            wlcElement: 'button_load-more-games',
            text: gettext('Load more games'),
        },
    },
    searchFilterName: 'page',
};
