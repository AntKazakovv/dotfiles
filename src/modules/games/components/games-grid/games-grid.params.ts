import {IIndexing, IComponentParams} from 'wlc-engine/modules/core';
import {IGamesFilterData} from 'wlc-engine/modules/games';
import {ITournamentGames} from 'wlc-engine/modules/tournaments';
import {IBannersSliderCParams} from 'wlc-engine/modules/promo';

export type GGType = 'default' | 'search';

//TODO remove this interface after fix in GamesGrid configuration in project layouts
export interface IGamesFilterEasy {
    category?: string;
}

export interface IGamesGridCParams extends IComponentParams<string, GGType, string> {
    gamesRows: number;
    filter?: IGamesFilterData | IGamesFilterEasy;
    byState?: boolean;
    title?: string;
    usePlaceholders: boolean;
    showTitle?: boolean;
    titleIcon?: {
        name?: string,
        byCategory?: boolean;
        folder?: string;
    };
    bannerSettings?: IBannersSliderCParams;
    tournamentGamesFilter?: ITournamentGames;
    titleIconByCategory?: boolean;
    showAllLink?: {
        use?: boolean;
        useCounter?: boolean;
        link?: string;
        params?: IIndexing<string>;
        text?: string;
    };
    moreBtn?: {
        hide?: boolean;
        lazy?: boolean;
        lazyTimeout?: number;
        scrollToEnd?: boolean;
    };
    hideOnEmptySearch?: boolean;
    searchFilterName?: string; // search param searchFrom must has the same name
    mobileSettings?: {
        showLoadButton?: boolean;
        gamesRows?: number;
    };
    hideEmpty?: boolean;
    showProgressBar?: boolean;
    thumbParams?: string,
}

export const defaultParams: IGamesGridCParams = {
    class: 'wlc-games-grid',
    gamesRows: 4,
    usePlaceholders: true,
    showTitle: true,
    showAllLink: {
        use: false,
    },
    moreBtn: {
        hide: false,
        lazy: false,
        lazyTimeout: 1000,
        scrollToEnd: true,
    },
};
